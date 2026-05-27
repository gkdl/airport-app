import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ParkingService } from './parking.service';
import { ParkingQueryDto } from './dto/parking-query.dto';
import { CACHE_TTL } from '../common/cache-ttl.constant';

@ApiTags('parking')
@Controller('parking')
@UseInterceptors(CacheInterceptor)
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Get()
  @ApiOperation({ summary: '주차 현황 목록' })
  @CacheTTL(CACHE_TTL.PARKING)
  async getParking(@Query() query: ParkingQueryDto) {
    return this.parkingService.getParking(query);
  }

  @Get('summary')
  @ApiOperation({ summary: '공항별 주차 요약' })
  @CacheTTL(CACHE_TTL.PARKING)
  async getSummary(@Query('airportCode') airportCode: string) {
    return this.parkingService.getParkingSummary(airportCode);
  }
}
