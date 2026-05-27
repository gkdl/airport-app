import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ImmigrationService } from './immigration.service';
import { ImmigrationQueryDto } from './dto/immigration-query.dto';
import { CACHE_TTL } from '../common/cache-ttl.constant';

@ApiTags('immigration')
@Controller('immigration')
@UseInterceptors(CacheInterceptor)
export class ImmigrationController {
  constructor(private readonly immigrationService: ImmigrationService) {}

  @Get()
  @ApiOperation({ summary: '입출국장 혼잡도' })
  @CacheTTL(CACHE_TTL.IMMIGRATION)
  async getImmigration(@Query() query: ImmigrationQueryDto) {
    return this.immigrationService.getImmigration(query);
  }
}
