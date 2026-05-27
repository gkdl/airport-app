import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpClientService } from '../common/http-client.service';
import { FlightStatusRepository } from '../repositories/flight-status.repository';
import { FlightStatusEntity } from '../entities/flight-status.entity';
import { BatchLogEntity } from '../common/batch-log.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Processor('kac-flight')
@Injectable()
export class KacFlightJob extends WorkerHost {
  private readonly logger = new Logger(KacFlightJob.name);
  private readonly BASE_URL = 'http://apis.data.go.kr/1613000/AirFlightInfoService/getAirFlightInfoList';

  constructor(
    private readonly http: HttpClientService,
    private readonly flightRepo: FlightStatusRepository,
    @InjectRepository(BatchLogEntity)
    private readonly batchLogRepo: Repository<BatchLogEntity>,
    @InjectQueue('notification')
    private readonly notificationQueue: Queue,
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
          numOfRows: '200',
          pageNo: '1',
          airportCode,
        },
      );

      const items = data?.response?.body?.items?.item ?? [];
      for (const item of items) {
        const entity = this.mapToEntity(item as Record<string, unknown>, airportCode);
        const prevStatus = await this.flightRepo.findPreviousStatus(entity.flightId, entity.flightDate);
        await this.flightRepo.upsert(entity);

        if (prevStatus && prevStatus !== entity.status) {
          await this.notificationQueue.add('status-changed', {
            flightNo: entity.flightNo,
            airportCode: entity.airportCode,
            prevStatus,
            newStatus: entity.status,
          });
        }
        recordsCount++;
      }

      await this.saveBatchLog({ jobName: 'KAC_FLIGHT', airportCode, status: 'SUCCESS', recordsCount, startedAt });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`KacFlightJob[${airportCode}] failed: ${msg}`);
      await this.saveBatchLog({ jobName: 'KAC_FLIGHT', airportCode, status: 'FAIL', recordsCount, startedAt, errorMessage: msg });
      throw error;
    }
  }

  private mapToEntity(item: Record<string, unknown>, airportCode: string): FlightStatusEntity {
    const entity = new FlightStatusEntity();
    const scheduledTime = new Date(String(item['domesticScheduleDateTime'] ?? item['internationalScheduleDateTime'] ?? ''));
    entity.flightId = `${airportCode}-${String(item['flightId'] ?? '')}-${scheduledTime.toISOString().split('T')[0] ?? ''}`;
    entity.flightDate = new Date(scheduledTime.toISOString().split('T')[0] ?? '');
    entity.airportCode = airportCode;
    entity.airportType = 'KAC';
    entity.airline = String(item['airlineNm'] ?? '');
    entity.flightNo = String(item['flightId'] ?? '');
    entity.direction = String(item['inout'] ?? '') === 'O' ? 'DEPARTURE' : 'ARRIVAL';
    entity.scheduledTime = scheduledTime;
    entity.status = String(item['flightStatusCode'] ?? 'SCHEDULED');
    entity.origin = String(item['departAirportNm'] ?? '') || undefined;
    entity.destination = String(item['arriveAirportNm'] ?? '') || undefined;
    entity.flightType = String(item['domesticFlag'] ?? '') === 'D' ? 'DOMESTIC' : 'INTERNATIONAL';
    return entity;
  }

  private async saveBatchLog(params: { jobName: string; airportCode?: string; status: 'SUCCESS' | 'FAIL'; recordsCount: number; startedAt: Date; errorMessage?: string }) {
    const log = new BatchLogEntity();
    log.jobName = params.jobName;
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
