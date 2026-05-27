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

@Processor('kac-parking')
@Injectable()
export class KacParkingJob extends WorkerHost {
  private readonly logger = new Logger(KacParkingJob.name);
  private readonly BASE_URL = 'http://apis.data.go.kr/1613000/AirportParkingInfoService/getAirportParkingInfo';

  constructor(
    private readonly http: HttpClientService,
    private readonly parkingRepo: ParkingStatusRepository,
    @InjectRepository(BatchLogEntity)
    private readonly batchLogRepo: Repository<BatchLogEntity>,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const startedAt = new Date();
    const { airportCode } = job.data as { airportCode: string };
    let recordsCount = 0;

    try {
      const data = await this.http.fetchWithRetry<{ response: { body: { items: { item: unknown[] } } } }>(
        this.BASE_URL,
        {
          serviceKey: this.config.get<string>('KAC_API_KEY', ''),
          type: 'json',
          airportCode,
        },
      );

      const items = data?.response?.body?.items?.item ?? [];
      for (const item of items) {
        const entity = this.mapToEntity(item as Record<string, unknown>, airportCode);
        await this.parkingRepo.upsert(entity);
        recordsCount++;
      }

      await this.saveBatchLog({ airportCode, status: 'SUCCESS', recordsCount, startedAt });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`KacParkingJob[${airportCode}] failed: ${msg}`);
      await this.saveBatchLog({ airportCode, status: 'FAIL', recordsCount, startedAt, errorMessage: msg });
      throw error;
    }
  }

  private mapToEntity(item: Record<string, unknown>, airportCode: string): ParkingStatusEntity {
    const entity = new ParkingStatusEntity();
    const total = Number(item['parkingTotal'] ?? 0);
    const occupied = Number(item['parkingCurrent'] ?? 0);
    entity.parkingId = `${airportCode}-${String(item['parkingId'] ?? '')}`;
    entity.airportCode = airportCode;
    entity.airportType = 'KAC';
    entity.zone = String(item['parkingNm'] ?? '');
    entity.totalSpots = total;
    entity.occupiedSpots = occupied;
    entity.availableSpots = Math.max(0, total - occupied);
    entity.congestionLevel = calcCongestionLevel(occupied, total);
    entity.recordedAt = new Date();
    return entity;
  }

  private async saveBatchLog(params: { airportCode?: string; status: 'SUCCESS' | 'FAIL'; recordsCount: number; startedAt: Date; errorMessage?: string }) {
    const log = new BatchLogEntity();
    log.jobName = 'KAC_PARKING';
    log.airportCode = params.airportCode;
    log.status = params.status;
    log.recordsCount = params.recordsCount;
    log.startedAt = params.startedAt;
    log.finishedAt = new Date();
    log.durationMs = log.finishedAt.getTime() - params.startedAt.getTime();
    log.errorMessage = params.errorMessage;
    await this.batchLogRepo.save(log);
  }
}
