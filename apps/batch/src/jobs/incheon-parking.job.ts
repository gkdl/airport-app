import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpClientService } from '../common/http-client.service';
import { ParkingStatusRepository } from '../repositories/parking-status.repository';
import { ParkingStatusEntity } from '../entities/parking-status.entity';
import { BatchLogEntity } from '../common/batch-log.entity';
import { ConfigService } from '@nestjs/config';
import { calcCongestionLevel } from '@airport-app/utils';

@Processor('incheon-parking')
@Injectable()
export class IncheonParkingJob extends WorkerHost {
  private readonly logger = new Logger(IncheonParkingJob.name);
  private readonly BASE_URL = 'http://apis.data.go.kr/B551177/StatusOfParkingODE/getStatusOfParking';

  constructor(
    private readonly http: HttpClientService,
    private readonly parkingRepo: ParkingStatusRepository,
    @InjectRepository(BatchLogEntity)
    private readonly batchLogRepo: Repository<BatchLogEntity>,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async process(_job: Job): Promise<void> {
    const startedAt = new Date();
    let recordsCount = 0;

    try {
      const data = await this.http.fetchWithRetry<{ response: { body: { items: { item: unknown[] } } } }>(
        this.BASE_URL,
        { serviceKey: this.config.get<string>('INCHEON_API_KEY', ''), type: 'json' },
      );

      const items = data?.response?.body?.items?.item ?? [];
      for (const item of items) {
        const entity = this.mapToEntity(item as Record<string, unknown>);
        await this.parkingRepo.upsert(entity);
        recordsCount++;
      }

      await this.saveBatchLog({ status: 'SUCCESS', recordsCount, startedAt });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`IncheonParkingJob failed: ${msg}`);
      await this.saveBatchLog({ status: 'FAIL', recordsCount, startedAt, errorMessage: msg });
      throw error;
    }
  }

  private mapToEntity(item: Record<string, unknown>): ParkingStatusEntity {
    const entity = new ParkingStatusEntity();
    const total = Number(item['parkingArea'] ?? 0);
    const occupied = Number(item['nowParking'] ?? 0);
    entity.parkingId = `ICN-${String(item['parkingAreaNo'] ?? '')}`;
    entity.airportCode = 'ICN';
    entity.airportType = 'INCHEON';
    entity.zone = String(item['areaNameE'] ?? '');
    entity.terminal = String(item['terminalId'] ?? '') || undefined;
    entity.parkingType = 'SHORT';
    entity.totalSpots = total;
    entity.occupiedSpots = occupied;
    entity.availableSpots = Math.max(0, total - occupied);
    entity.congestionLevel = calcCongestionLevel(occupied, total);
    entity.recordedAt = new Date();
    return entity;
  }

  private async saveBatchLog(params: { status: 'SUCCESS' | 'FAIL'; recordsCount: number; startedAt: Date; errorMessage?: string }) {
    const log = new BatchLogEntity();
    log.jobName = 'INCHEON_PARKING';
    log.airportCode = 'ICN';
    log.status = params.status;
    log.recordsCount = params.recordsCount;
    log.startedAt = params.startedAt;
    log.finishedAt = new Date();
    log.durationMs = log.finishedAt.getTime() - params.startedAt.getTime();
    log.errorMessage = params.errorMessage;
    await this.batchLogRepo.save(log);
  }
}
