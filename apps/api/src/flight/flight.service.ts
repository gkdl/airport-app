import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { FlightStatusEntity } from '../entities/flight-status.entity';
import { FlightQueryDto } from './dto/flight-query.dto';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(FlightStatusEntity)
    private readonly repo: Repository<FlightStatusEntity>,
  ) {}

  async getRealtimeFlights(query: FlightQueryDto): Promise<FlightStatusEntity[]> {
    const qb = this.repo.createQueryBuilder('f');
    qb.where("TRUNC(f.flightDate) = TRUNC(SYSDATE)");
    if (query.airportCode) qb.andWhere('f.airportCode = :airportCode', { airportCode: query.airportCode });
    if (query.direction)   qb.andWhere('f.direction = :direction', { direction: query.direction });
    if (query.terminal)    qb.andWhere('f.terminal = :terminal', { terminal: query.terminal });
    if (query.status)      qb.andWhere('f.status = :status', { status: query.status });
    if (query.flightNo)    qb.andWhere('f.flightNo LIKE :flightNo', { flightNo: `%${query.flightNo}%` });
    qb.orderBy("CASE f.status WHEN 'DELAYED' THEN 0 WHEN 'CANCELLED' THEN 1 ELSE 2 END")
      .addOrderBy('f.scheduledTime', 'ASC');
    return qb.getMany();
  }

  async getFlightByNo(flightNo: string): Promise<FlightStatusEntity | null> {
    return this.repo.createQueryBuilder('f')
      .where('f.flightNo = :flightNo', { flightNo })
      .andWhere("TRUNC(f.flightDate) = TRUNC(SYSDATE)")
      .getOne();
  }
}
