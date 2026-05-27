import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherInfoEntity } from '../entities/weather-info.entity';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherInfoEntity])],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
