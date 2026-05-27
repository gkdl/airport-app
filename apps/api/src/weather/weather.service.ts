import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherInfoEntity } from '../entities/weather-info.entity';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(WeatherInfoEntity)
    private readonly repo: Repository<WeatherInfoEntity>,
  ) {}

  async getWeather(airportCode: string): Promise<WeatherInfoEntity | null> {
    return this.repo.createQueryBuilder('w')
      .where('w.airportCode = :airportCode', { airportCode })
      .orderBy('w.forecastDate', 'DESC')
      .getOne();
  }
}
