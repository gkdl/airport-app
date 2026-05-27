import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpClientService } from '../common/http-client.service';
import { ImmigrationStatusRepository } from '../repositories/immigration-status.repository';
import { ImmigrationStatusEntity } from '../entities/immigration-status.entity';
import { BatchLogEntity } from '../common/batch-log.entity';
import { ConfigService } from '@nestjs/config';
import { CongestionLevel } from '@airport-app/types';

@Processor('immigration')
@Injectable()
export class ImmigrationJob extends WorkerHost {
  private readonly logger = new Logger(ImmigrationJob.name);
  private readonly ARRIVAL_URL = 'http://apis.data.go.kr/B551177/StatusOfPassengerCongestion/getArrivalPassengerCongestion';
  private readonly DEPARTURE_URL = 'http://apis.data.go.kr/B551177/StatusOfPassengerCongestion/getDeparturePassengerCongestion';

  constructor(
    private readonly http: HttpClientService,
    private readonly immigrationRepo: ImmigrationStatusRepository,
    @InjectRepository(BatchLogEntity)
    private readonly batchLogRepo: Repository<BatchLogEntity>,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const startedAt = new Date();
    const { direction, airportCode } = job.data as { direction: 'ARRIVAL' | 'DEPARTURE'; airportCode: string };
    let recordsCount = 0;

    try {
      const url = direction === 'ARRIVAL' ? this.ARRIVAL_URL : this.DEPARTURE_URL;
      const data = await this.http.fetchWithRetry<{ response: { body: { items: { item: unknown[] } } } }>(
        url,
        { serviceKey: this.config.get<string>('INCHEON_API_KEY', ''), type: 'json' },
      );

      const items = data?.response?.body?.items?.item ?? [];
      for (const item of items) {
        const entity = this.mapToEntity(item as Record<string, unknown>, direction, airportCode);
        await this.immigrationRepo.upsert(entity);
        recordsCount++;
      }

      await this.saveBatchLog({ direction, status: 'SUCCESS', recordsCount, startedAt });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`ImmigrationJob[${direction}] failed: ${msg}`);
      await this.saveBatchLog({ direction, status: 'FAIL', recordsCount, startedAt, errorMessage: msg });
      throw error;
    }
  }

  private mapToEntity(item: Record<string, unknown>, direction: string, airportCode: string): ImmigrationStatusEntity {
    const entity = new ImmigrationStatusEntity();
    const gate = String(item['gateNo'] ?? item['gateId'] ?? '');
    const terminal = String(item['terminalId'] ?? 'T1');
    entity.immigrationId = `${airportCode}-${terminal}-${direction}-${gate}`;
    entity.airportCode = airportCode;
    entity.terminal = terminal;
    entity.direction = direction;
    entity.gate = gate;
    entity.waitingCount = Number(item['totalWaitCount'] ?? item['waitCount'] ?? 0);
    entity.waitingCountKorean = Number(item['koWaitCount'] ?? 0);
    entity.waitingCountForeign = Number(item['foWaitCount'] ?? 0);
    entity.congestionLevel = this.mapCongestionLevel(String(item['congestionLevel'] ?? ''));
    entity.recordedAt = new Date();
    return entity;
  }

  private mapCongestionLevel(level: string): CongestionLevel {
    const map: Record<string, CongestionLevel> = {
      '여유': CongestionLevel.AVAILABLE,
      '보통': CongestionLevel.NORMAL,
      '혼잡': CongestionLevel.CONGESTED,
      '매우혼잡': CongestionLevel.FULL,
    };
    return map[level] ?? CongestionLevel.NORMAL;
  }

  private async saveBatchLog(params: { direction?: string; status: 'SUCCESS' | 'FAIL'; recordsCount: number; startedAt: Date; errorMessage?: string }) {
    const log = new BatchLogEntity();
    log.jobName = 'IMMIGRATION';
    log.status = params.status;
    log.recordsCount = params.recordsCount;
    log.startedAt = params.startedAt;
    log.finishedAt = new Date();
    log.durationMs = log.finishedAt.getTime() - params.startedAt.getTime();
    log.errorMessage = params.errorMessage;
    await this.batchLogRepo.save(log);
  }
}
