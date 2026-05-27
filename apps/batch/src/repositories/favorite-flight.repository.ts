import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteFlightEntity } from '../entities/favorite-flight.entity';

@Injectable()
export class FavoriteFlightRepository {
  constructor(
    @InjectRepository(FavoriteFlightEntity)
    private readonly repo: Repository<FavoriteFlightEntity>,
  ) {}

  async findByFlightNo(flightNo: string, airportCode: string): Promise<FavoriteFlightEntity[]> {
    return this.repo.find({ where: { flightNo, airportCode } });
  }
}
