import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FavoriteFlightEntity } from './favorite-flight.entity';

@Entity('DEVICE')
export class DeviceEntity {
  @PrimaryColumn({ name: 'DEVICE_ID', length: 100 })
  deviceId!: string;

  @Column({ name: 'PUSH_TOKEN', length: 500, nullable: true })
  pushToken?: string;

  @Column({ name: 'PLATFORM', length: 10 })
  platform!: string;

  @Column({ name: 'APP_VERSION', length: 20, nullable: true })
  appVersion?: string;

  @Column({ name: 'NOTIFICATION_ON', default: 1 })
  notificationOn!: number;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @OneToMany(() => FavoriteFlightEntity, (fav) => fav.device)
  favorites!: FavoriteFlightEntity[];
}
