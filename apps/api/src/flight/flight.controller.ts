import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { FlightService } from './flight.service';
import { FlightQueryDto } from './dto/flight-query.dto';
import { CACHE_TTL } from '../common/cache-ttl.constant';

@ApiTags('flights')
@Controller('flights')
@UseInterceptors(CacheInterceptor)
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('realtime')
  @ApiOperation({ summary: '실시간 운항 현황' })
  @CacheTTL(CACHE_TTL.FLIGHT_REALTIME)
  async getRealtime(@Query() query: FlightQueryDto) {
    return this.flightService.getRealtimeFlights(query);
  }

  @Get(':flightNo')
  @ApiOperation({ summary: '특정 편명 운항 상세' })
  @CacheTTL(CACHE_TTL.FLIGHT_REALTIME)
  async getByFlightNo(@Param('flightNo') flightNo: string) {
    return this.flightService.getFlightByNo(flightNo);
  }
}
