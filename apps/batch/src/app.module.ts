import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchLogEntity } from './common/batch-log.entity';
import { FlightStatusEntity } from './entities/flight-status.entity';
import { ParkingStatusEntity } from './entities/parking-status.entity';
import { ImmigrationStatusEntity } from './entities/immigration-status.entity';
import { WeatherInfoEntity } from './entities/weather-info.entity';
import { DeviceEntity } from './entities/device.entity';
import { FavoriteFlightEntity } from './entities/favorite-flight.entity';
import { NotificationLogEntity } from './entities/notification-log.entity';

import { HttpClientService } from './common/http-client.service';
import { BudgetService } from './common/budget.service';

import { FlightStatusRepository } from './repositories/flight-status.repository';
import { ParkingStatusRepository } from './repositories/parking-status.repository';
import { ImmigrationStatusRepository } from './repositories/immigration-status.repository';
import { WeatherRepository } from './repositories/weather.repository';
import { DeviceRepository } from './repositories/device.repository';
import { FavoriteFlightRepository } from './repositories/favorite-flight.repository';
import { NotificationLogRepository } from './repositories/notification-log.repository';

import { FlightRealtimeScheduler } from './schedulers/flight-realtime.scheduler';
import { ParkingScheduler } from './schedulers/parking.scheduler';
import { ImmigrationScheduler } from './schedulers/immigration.scheduler';
import { WeatherScheduler } from './schedulers/weather.scheduler';
import { BudgetCheckScheduler } from './schedulers/budget-check.scheduler';

import { IncheonFlightJob } from './jobs/incheon-flight.job';
import { KacFlightJob } from './jobs/kac-flight.job';
import { IncheonParkingJob } from './jobs/incheon-parking.job';
import { KacParkingJob } from './jobs/kac-parking.job';
import { ImmigrationJob } from './jobs/immigration.job';
import { WeatherJob } from './jobs/weather.job';
import { NotificationJob } from './jobs/notification.job';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.batch' }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'incheon-flight' },
      { name: 'kac-flight' },
      { name: 'incheon-parking' },
      { name: 'kac-parking' },
      { name: 'immigration' },
      { name: 'weather' },
      { name: 'notification' },
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const connectString = config.get<string>('DB_CONNECT_STRING');
        return {
          type: 'oracle',
          // Wallet 사용 시 connectString(TNS alias), 미사용 시 host/port/sid
          ...(connectString
            ? { connectString }
            : {
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT', 1521),
                sid: config.get<string>('DB_SID'),
              }),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          entities: [
            BatchLogEntity,
            FlightStatusEntity,
            ParkingStatusEntity,
            ImmigrationStatusEntity,
            WeatherInfoEntity,
            DeviceEntity,
            FavoriteFlightEntity,
            NotificationLogEntity,
          ],
          synchronize: false,
          logging: config.get('NODE_ENV') !== 'production',
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      BatchLogEntity,
      FlightStatusEntity,
      ParkingStatusEntity,
      ImmigrationStatusEntity,
      WeatherInfoEntity,
      DeviceEntity,
      FavoriteFlightEntity,
      NotificationLogEntity,
    ]),
  ],
  providers: [
    HttpClientService,
    BudgetService,
    FlightStatusRepository,
    ParkingStatusRepository,
    ImmigrationStatusRepository,
    WeatherRepository,
    DeviceRepository,
    FavoriteFlightRepository,
    NotificationLogRepository,
    FlightRealtimeScheduler,
    ParkingScheduler,
    ImmigrationScheduler,
    WeatherScheduler,
    BudgetCheckScheduler,
    IncheonFlightJob,
    KacFlightJob,
    IncheonParkingJob,
    KacParkingJob,
    ImmigrationJob,
    WeatherJob,
    NotificationJob,
  ],
})
export class AppModule {}
