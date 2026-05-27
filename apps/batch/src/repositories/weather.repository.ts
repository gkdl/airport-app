import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherInfoEntity } from '../entities/weather-info.entity';

@Injectable()
export class WeatherRepository {
  constructor(
    @InjectRepository(WeatherInfoEntity)
    private readonly repo: Repository<WeatherInfoEntity>,
  ) {}

  async upsert(entity: WeatherInfoEntity): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(WeatherInfoEntity)
      .values(entity)
      .orUpdate(['TEMPERATURE', 'FEELS_LIKE', 'HUMIDITY', 'WIND_SPEED', 'WEATHER_CODE', 'WEATHER_ICON_URL', 'FORECAST_DATE', 'UPDATED_AT'], ['WEATHER_ID'])
      .execute();
  }
}
