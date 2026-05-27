import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('PARKING_STATUS')
export class ParkingStatusEntity {
  @PrimaryColumn({ name: 'PARKING_ID', length: 100 })
  parkingId!: string;

  @Column({ name: 'AIRPORT_CODE', length: 10 })
  airportCode!: string;

  @Column({ name: 'AIRPORT_TYPE', length: 10 })
  airportType!: string;

  @Column({ name: 'ZONE', length: 50 })
  zone!: string;

  @Column({ name: 'TERMINAL', length: 10, nullable: true })
  terminal?: string;

  @Column({ name: 'PARKING_TYPE', length: 10, nullable: true })
  parkingType?: string;

  @Column({ name: 'TOTAL_SPOTS' })
  totalSpots!: number;

  @Column({ name: 'OCCUPIED_SPOTS' })
  occupiedSpots!: number;

  @Column({ name: 'AVAILABLE_SPOTS' })
  availableSpots!: number;

  @Column({ name: 'CONGESTION_LEVEL', length: 15 })
  congestionLevel!: string;

  @Column({ name: 'RECORDED_AT', type: 'timestamp' })
  recordedAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
