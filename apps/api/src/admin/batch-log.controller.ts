import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { BatchLogEntity } from '../entities/batch-log.entity';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/batch-logs')
export class BatchLogController {
  constructor(
    @InjectRepository(BatchLogEntity)
    private readonly batchLogRepo: Repository<BatchLogEntity>,
  ) {}

  @Get()
  @ApiOperation({ summary: '배치 실행 로그 조회' })
  async getLogs(
    @Query('jobName') jobName?: string,
    @Query('limit') limit = '50',
  ) {
    const qb = this.batchLogRepo
      .createQueryBuilder('l')
      .orderBy('l.startedAt', 'DESC')
      .take(Math.min(parseInt(limit, 10), 200));

    if (jobName) {
      qb.where('l.jobName = :jobName', { jobName });
    }

    return qb.getMany();
  }
}
