import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../entities/device.entity';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly repo: Repository<DeviceEntity>,
  ) {}

  async findByDeviceId(deviceId: string): Promise<DeviceEntity | null> {
    return this.repo.findOne({ where: { deviceId } });
  }

  async findPushTokensByFlightNo(flightNo: string, airportCode: string): Promise<{ deviceId: string; pushToken: string; notifyDelay: number; notifyCancel: number; notifyBoarding: number }[]> {
    return this.repo
      .createQueryBuilder('d')
      .select(['d.deviceId', 'd.pushToken', 'f.notifyDelay', 'f.notifyCancel', 'f.notifyBoarding'])
      .innerJoin('FAVORITE_FLIGHT', 'f', 'f.DEVICE_ID = d.DEVICE_ID')
      .where('f.FLIGHT_NO = :flightNo', { flightNo })
      .andWhere('f.AIRPORT_CODE = :airportCode', { airportCode })
      .andWhere('d.NOTIFICATION_ON = 1')
      .andWhere('d.PUSH_TOKEN IS NOT NULL')
      .getRawMany();
  }
}
