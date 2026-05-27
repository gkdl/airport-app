import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImmigrationStatusEntity } from '../entities/immigration-status.entity';
import { ImmigrationQueryDto } from './dto/immigration-query.dto';

@Injectable()
export class ImmigrationService {
  constructor(
    @InjectRepository(ImmigrationStatusEntity)
    private readonly repo: Repository<ImmigrationStatusEntity>,
  ) {}

  async getImmigration(query: ImmigrationQueryDto): Promise<ImmigrationStatusEntity[]> {
    const qb = this.repo.createQueryBuilder('i');
    if (query.airportCode) qb.where('i.airportCode = :airportCode', { airportCode: query.airportCode });
    if (query.terminal)    qb.andWhere('i.terminal = :terminal', { terminal: query.terminal });
    if (query.direction)   qb.andWhere('i.direction = :direction', { direction: query.direction });
    qb.orderBy('i.terminal').addOrderBy('i.gate');
    return qb.getMany();
  }
}
