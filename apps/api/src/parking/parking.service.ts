import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingStatusEntity } from '../entities/parking-status.entity';
import { ParkingQueryDto } from './dto/parking-query.dto';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingStatusEntity)
    private readonly repo: Repository<ParkingStatusEntity>,
  ) {}

  async getParking(query: ParkingQueryDto): Promise<ParkingStatusEntity[]> {
    const qb = this.repo.createQueryBuilder('p');
    if (query.airportCode) qb.where('p.airportCode = :airportCode', { airportCode: query.airportCode });
    if (query.terminal)    qb.andWhere('p.terminal = :terminal', { terminal: query.terminal });
    if (query.parkingType) qb.andWhere('p.parkingType = :parkingType', { parkingType: query.parkingType });
    qb.orderBy('p.airportCode').addOrderBy('p.zone');
    return qb.getMany();
  }

  async getParkingSummary(airportCode: string): Promise<{ airportCode: string; totalSpots: number; availableSpots: number; congestionLevel: string }> {
    const result = await this.repo
      .createQueryBuilder('p')
      .select('SUM(p.totalSpots)', 'totalSpots')
      .addSelect('SUM(p.availableSpots)', 'availableSpots')
      .where('p.airportCode = :airportCode', { airportCode })
      .getRawOne<{ totalSpots: string; availableSpots: string }>();

    const total = parseInt(result?.totalSpots ?? '0', 10);
    const available = parseInt(result?.availableSpots ?? '0', 10);
    const ratio = total > 0 ? (total - available) / total : 0;
    const congestionLevel = ratio < 0.7 ? 'AVAILABLE' : ratio < 0.85 ? 'NORMAL' : ratio < 0.95 ? 'CONGESTED' : 'FULL';

    return { airportCode, totalSpots: total, availableSpots: available, congestionLevel };
  }
}
