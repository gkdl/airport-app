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

@Processor('incheon-flight')
@Injectable()
export class IncheonFlightJob extends WorkerHost {
  private readonly logger = new Logger(IncheonFlightJob.name);
  private readonly BASE_URL = 'http://apis.data.go.kr/B551177/StatusOfPassengerFlightsODE/getFlightStatusList';

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
    const { terminals, directions } = job.data as { terminals: string[]; directions: string[] };
    let recordsCount = 0;

    try {
      for (const terminal of terminals) {
        for (const direction of directions) {
          const data = await this.http.fetchWithRetry<{ response: { body: { items: { item: unknown[] } } } }>(
            this.BASE_URL,
            {
              serviceKey: this.config.get<string>('INCHEON_API_KEY', ''),
              type: 'json',
              numOfRows: '500',
              pageNo: '1',
              query_type: direction === 'DEPARTURE' ? 'D' : 'A',
              terminal,
            },
          );

          const items = data?.response?.body?.items?.item ?? [];
          for (const item of items) {
            const entity = this.mapToEntity(item as Record<string, unknown>, terminal);
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
        }
      }

      await this.saveBatchLog({ jobName: 'INCHEON_FLIGHT', status: 'SUCCESS', recordsCount, startedAt });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`IncheonFlightJob failed: ${msg}`);
      await this.saveBatchLog({ jobName: 'INCHEON_FLIGHT', status: 'FAIL', recordsCount, startedAt, errorMessage: msg });
      throw error;
    }
  }

  private mapToEntity(item: Record<string, unknown>, terminal: string): FlightStatusEntity {
    const entity = new FlightStatusEntity();
    const scheduledTime = new Date(String(item['scheduleDateTime'] ?? ''));
    entity.flightId = `ICN-${String(item['flightId'] ?? '')}-${scheduledTime.toISOString().split('T')[0] ?? ''}`;
    entity.flightDate = new Date(scheduledTime.toISOString().split('T')[0] ?? '');
    entity.airportCode = 'ICN';
    entity.airportType = 'INCHEON';
    entity.airline = String(item['airlineKorean'] ?? '');
    entity.flightNo = String(item['flightId'] ?? '');
    entity.direction = String(item['io'] ?? '') === 'O' ? 'DEPARTURE' : 'ARRIVAL';
    entity.terminal = terminal;
    entity.gate = String(item['gateNumber'] ?? '') || undefined;
    entity.scheduledTime = scheduledTime;
    entity.estimatedTime = item['estimatedDateTime'] ? new Date(String(item['estimatedDateTime'])) : undefined;
    entity.actualTime = item['realDateTime'] ? new Date(String(item['realDateTime'])) : undefined;
    entity.status = this.mapStatus(String(item['flightStatusCode'] ?? ''));
    entity.origin = String(item['boardingKor'] ?? '') || undefined;
    entity.destination = String(item['arrivedKor'] ?? '') || undefined;
    entity.baggageClaim = String(item['carousel'] ?? '') || undefined;
    entity.flightType = String(item['typeOfFlight'] ?? '') === 'I' ? 'INTERNATIONAL' : 'DOMESTIC';
    return entity;
  }

  private mapStatus(code: string): string {
    const map: Record<string, string> = {
      'OT': 'SCHEDULED', 'DL': 'DELAYED', 'CN': 'CANCELLED',
      'DP': 'DEPARTED', 'AR': 'ARRIVED', 'BD': 'BOARDING',
      'DV': 'DIVERTED', 'LD': 'LANDED',
    };
    return map[code] ?? 'SCHEDULED';
  }

  private async saveBatchLog(params: { jobName: string; status: 'SUCCESS' | 'FAIL'; recordsCount: number; startedAt: Date; errorMessage?: string }) {
    const log = new BatchLogEntity();
    log.jobName = params.jobName;
    log.status = params.status;
    log.recordsCount = params.recordsCount;
    log.startedAt = params.startedAt;
    log.finishedAt = new Date();
    log.durationMs = log.finishedAt.getTime() - params.startedAt.getTime();
    log.errorMessage = params.errorMessage;
    await this.batchLogRepo.save(log);
  }
}
