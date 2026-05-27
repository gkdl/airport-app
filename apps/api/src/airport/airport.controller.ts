import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ALL_AIRPORTS } from '@airport-app/utils';
import { CACHE_TTL } from '../common/cache-ttl.constant';

@ApiTags('airports')
@Controller('airports')
@UseInterceptors(CacheInterceptor)
export class AirportController {
  @Get()
  @ApiOperation({ summary: '전국 공항 목록' })
  @CacheTTL(CACHE_TTL.AIRPORT_META)
  getAirports() {
    return ALL_AIRPORTS;
  }
}
