import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../entities/device.entity';
import { FavoriteFlightEntity } from '../entities/favorite-flight.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(FavoriteFlightEntity)
    private readonly favRepo: Repository<FavoriteFlightEntity>,
  ) {}

  async registerDevice(dto: CreateDeviceDto): Promise<DeviceEntity> {
    const existing = await this.deviceRepo.findOne({ where: { deviceId: dto.deviceId } });
    if (existing) {
      existing.appVersion = dto.appVersion;
      return this.deviceRepo.save(existing);
    }
    const device = this.deviceRepo.create({
      deviceId: dto.deviceId,
      platform: dto.platform,
      appVersion: dto.appVersion,
    });
    return this.deviceRepo.save(device);
  }

  async updatePushToken(deviceId: string, dto: UpdatePushTokenDto): Promise<DeviceEntity> {
    const device = await this.deviceRepo.findOne({ where: { deviceId } });
    if (!device) throw new NotFoundException('Device not found');
    device.pushToken = dto.pushToken;
    return this.deviceRepo.save(device);
  }

  async getFavorites(deviceId: string): Promise<FavoriteFlightEntity[]> {
    return this.favRepo.find({ where: { deviceId }, order: { createdAt: 'DESC' } });
  }

  async addFavorite(deviceId: string, dto: CreateFavoriteDto): Promise<FavoriteFlightEntity> {
    const fav = this.favRepo.create({
      deviceId,
      flightNo: dto.flightNo,
      airportCode: dto.airportCode,
      direction: dto.direction,
      notifyDelay: dto.notifyDelay ? 1 : 0,
      notifyCancel: dto.notifyCancel ? 1 : 0,
      notifyBoarding: dto.notifyBoarding ? 1 : 0,
    });
    return this.favRepo.save(fav);
  }

  async removeFavorite(deviceId: string, favoriteId: number): Promise<void> {
    const fav = await this.favRepo.findOne({ where: { favoriteId, deviceId } });
    if (!fav) throw new NotFoundException('Favorite not found');
    await this.favRepo.remove(fav);
  }
}
