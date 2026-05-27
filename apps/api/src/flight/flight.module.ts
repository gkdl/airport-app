import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightStatusEntity } from '../entities/flight-status.entity';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';

@Module({
  imports: [TypeOrmModule.forFeature([FlightStatusEntity])],
  controllers: [FlightController],
  providers: [FlightService],
})
export class FlightModule {}
