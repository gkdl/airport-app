import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpClientService } from '../common/http-client.service';
import { WeatherRepository } from '../repositories/weather.repository';
import { WeatherInfoEntity } from '../entities/weather-info.entity';
import { BatchLogEntity } from '../common/batch-log.entity';
import { ConfigService } from '@nestjs/config';

const AIRPORT_COORDS: Record<string, { nx: string; ny: string; cityName: string }> = {
  ICN: { nx: '55', ny: '124', cityName: '인천' },
  GMP: { nx: '58', ny: '126', cityName: '김포' },
  PUS: { nx: '98', ny: '76', cityName: '부산' },
  CJU: { nx: '52', ny: '38', cityName: '제주' },
  TAE: { nx: '89', ny: '90', cityName: '대구' },
  CJJ: { nx: '69', ny: '107', cityName: '청주' },
  MWX: { nx: '50', ny: '67', cityName: '무안' },
};

@Processor('weather')
@Injectable()
export class WeatherJob extends WorkerHost {
  private readonly logger = new Logger(WeatherJob.name);
  private readonly BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

  constructor(
    private readonly http: HttpClientService,
    private readonly weatherRepo: WeatherRepository,
    @InjectRepository(BatchLogEntity)
    private readonly batchLogRepo: Repository<BatchLogEntity>,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const startedAt = new Date();
    const { airportCode } = job.data as { airportCode: string };
    const coords = AIRPORT_COORDS[airportCode];
    if (!coords) return;

    try {
      const now = new Date();
      const baseDate = now.toISOString().split('T')[0]?.replace(/-/g, '') ?? '';
      const baseTime = '0500';

      const data = await this.http.fetchWithRetry<{ response: { body: { items: { item: unknown[] } } } }>(
        this.BASE_URL,
        {
          serviceKey: this.config.get<string>('KMA_API_KEY', ''),
          pageNo: '1',
          numOfRows: '100',
          dataType: 'JSON',
          base_date: baseDate,
          base_time: baseTime,
          nx: coords.nx,
          ny: coords.ny,
        },
      );

      const items = data?.response?.body?.items?.item ?? [];
      const entity = this.parseWeatherItems(items as Record<string, unknown>[], airportCode, coords.cityName);
      if (entity) {
        await this.weatherRepo.upsert(entity);
      }

      await this.saveBatchLog({ airportCode, status: 'SUCCESS', startedAt });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`WeatherJob[${airportCode}] failed: ${msg}`);
      await this.saveBatchLog({ airportCode, status: 'FAIL', startedAt, errorMessage: msg });
      throw error;
    }
  }

  private parseWeatherItems(items: Record<string, unknown>[], airportCode: string, cityName: string): WeatherInfoEntity | null {
    const entity = new WeatherInfoEntity();
    entity.weatherId = `${airportCode}-${new Date().toISOString().split('T')[0] ?? ''}`;
    entity.airportCode = airportCode;
    entity.cityName = cityName;
    entity.forecastDate = new Date();

    for (const item of items) {
      const category = String(item['category'] ?? '');
      const value = Number(item['fcstValue'] ?? 0);
      if (category === 'TMP') entity.temperature = value;
      if (category === 'REH') entity.humidity = value;
      if (category === 'WSD') entity.windSpeed = value;
      if (category === 'SKY') entity.weatherCode = String(value);
    }

    return entity;
  }

  private async saveBatchLog(params: { airportCode?: string; status: 'SUCCESS' | 'FAIL'; startedAt: Date; errorMessage?: string }) {
    const log = new BatchLogEntity();
    log.jobName = 'WEATHER';
    log.airportCode = params.airportCode;
    log.status = params.status;
    log.recordsCount = 1;
    log.startedAt = params.startedAt;
    log.finishedAt = new Date();
    log.durationMs = log.finishedAt.getTime() - params.startedAt.getTime();
    log.errorMessage = params.errorMessage;
    await this.batchLogRepo.save(log);
  }
}
