import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingStatusEntity } from '../entities/parking-status.entity';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingStatusEntity])],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
