import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';

@Entity('FAVORITE_FLIGHT')
export class FavoriteFlightEntity {
  @PrimaryGeneratedColumn({ name: 'FAVORITE_ID' })
  favoriteId!: number;

  @Column({ name: 'DEVICE_ID', length: 100 })
  deviceId!: string;

  @Column({ name: 'FLIGHT_NO', length: 20 })
  flightNo!: string;

  @Column({ name: 'AIRPORT_CODE', length: 10 })
  airportCode!: string;

  @Column({ name: 'DIRECTION', length: 15 })
  direction!: string;

  @Column({ name: 'NOTIFY_DELAY', default: 1 })
  notifyDelay!: number;

  @Column({ name: 'NOTIFY_CANCEL', default: 1 })
  notifyCancel!: number;

  @Column({ name: 'NOTIFY_BOARD', default: 1 })
  notifyBoarding!: number;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @ManyToOne(() => DeviceEntity, (device) => device.favorites)
  @JoinColumn({ name: 'DEVICE_ID' })
  device!: DeviceEntity;
}
