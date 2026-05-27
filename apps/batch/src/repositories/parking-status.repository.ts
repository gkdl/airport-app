import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingStatusEntity } from '../entities/parking-status.entity';

@Injectable()
export class ParkingStatusRepository {
  constructor(
    @InjectRepository(ParkingStatusEntity)
    private readonly repo: Repository<ParkingStatusEntity>,
  ) {}

  async upsert(entity: ParkingStatusEntity): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(ParkingStatusEntity)
      .values(entity)
      .orUpdate(['TOTAL_SPOTS', 'OCCUPIED_SPOTS', 'AVAILABLE_SPOTS', 'CONGESTION_LEVEL', 'RECORDED_AT', 'UPDATED_AT'], ['PARKING_ID'])
      .execute();
  }
}
