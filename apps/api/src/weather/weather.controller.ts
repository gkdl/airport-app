import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { WeatherService } from './weather.service';
import { CACHE_TTL } from '../common/cache-ttl.constant';

@ApiTags('weather')
@Controller('weather')
@UseInterceptors(CacheInterceptor)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: '공항 날씨 정보' })
  @CacheTTL(CACHE_TTL.WEATHER)
  async getWeather(@Query('airportCode') airportCode: string) {
    return this.weatherService.getWeather(airportCode);
  }
}
