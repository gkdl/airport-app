import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImmigrationStatusEntity } from '../entities/immigration-status.entity';
import { ImmigrationController } from './immigration.controller';
import { ImmigrationService } from './immigration.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImmigrationStatusEntity])],
  controllers: [ImmigrationController],
  providers: [ImmigrationService],
})
export class ImmigrationModule {}
