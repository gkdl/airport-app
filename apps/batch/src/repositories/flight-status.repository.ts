import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FlightStatusEntity } from '../entities/flight-status.entity';

@Injectable()
export class FlightStatusRepository {
  constructor(
    @InjectRepository(FlightStatusEntity)
    private readonly repo: Repository<FlightStatusEntity>,
  ) {}

  async upsert(entity: FlightStatusEntity): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .insert()
      .into(FlightStatusEntity)
      .values(entity)
      .orUpdate(['AIRLINE', 'STATUS', 'GATE', 'ESTIMATED_TIME', 'ACTUAL_TIME', 'TERMINAL', 'UPDATED_AT'], ['FLIGHT_ID', 'FLIGHT_DATE'])
      .execute();
  }

  async findPreviousStatus(flightId: string, flightDate: Date): Promise<string | null> {
    const result = await this.repo.findOne({
      where: { flightId, flightDate },
      select: { status: true },
    });
    return result?.status ?? null;
  }

  async bulkUpsert(entities: FlightStatusEntity[]): Promise<void> {
    for (const entity of entities) {
      await this.upsert(entity);
    }
  }
}
