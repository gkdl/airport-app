import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImmigrationStatusEntity } from '../entities/immigration-status.entity';

@Injectable()
export class ImmigrationStatusRepository {
  constructor(
    @InjectRepository(ImmigrationStatusEntity)
    private readonly repo: Repository<ImmigrationStatusEntity>,
  ) {}

  async upsert(entity: ImmigrationStatusEntity): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(ImmigrationStatusEntity)
      .values(entity)
      .orUpdate(['WAITING_COUNT', 'WAITING_KOR', 'WAITING_FOR', 'CONGESTION_LEVEL', 'RECORDED_AT', 'UPDATED_AT'], ['IMMIGRATION_ID'])
      .execute();
  }
}
