import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';

import { FlightModule } from './flight/flight.module';
import { ParkingModule } from './parking/parking.module';
import { ImmigrationModule } from './immigration/immigration.module';
import { WeatherModule } from './weather/weather.module';
import { DeviceModule } from './device/device.module';
import { AirportModule } from './airport/airport.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.api' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'oracle',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT', 1521),
        sid: config.get<string>('DB_SID'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: config.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: await import('cache-manager-ioredis-yet').then(m => m.redisStore),
        host: config.get<string>('REDIS_HOST', 'localhost'),
        port: config.get<number>('REDIS_PORT', 6379),
        password: config.get<string>('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    FlightModule,
    ParkingModule,
    ImmigrationModule,
    WeatherModule,
    DeviceModule,
    AirportModule,
    AdminModule,
  ],
})
export class AppModule {}
