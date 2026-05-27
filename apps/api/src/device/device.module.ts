import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from '../entities/device.entity';
import { FavoriteFlightEntity } from '../entities/favorite-flight.entity';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, FavoriteFlightEntity])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
