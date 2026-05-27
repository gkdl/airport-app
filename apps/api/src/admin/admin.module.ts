import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminUserEntity } from '../entities/admin-user.entity';
import { BatchLogEntity } from '../entities/batch-log.entity';
import { AdminController } from './admin.controller';
import { BatchLogController } from './batch-log.controller';
import { AdminService } from './admin.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUserEntity, BatchLogEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'secret'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '7d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController, BatchLogController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}
