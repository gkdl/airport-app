import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('IMMIGRATION_STATUS')
export class ImmigrationStatusEntity {
  @PrimaryColumn({ name: 'IMMIGRATION_ID', length: 100 })
  immigrationId!: string;

  @Column({ name: 'AIRPORT_CODE', length: 10 })
  airportCode!: string;

  @Column({ name: 'TERMINAL', length: 10 })
  terminal!: string;

  @Column({ name: 'DIRECTION', length: 15 })
  direction!: string;

  @Column({ name: 'GATE', length: 10 })
  gate!: string;

  @Column({ name: 'WAITING_COUNT', default: 0 })
  waitingCount!: number;

  @Column({ name: 'WAITING_KOR', default: 0 })
  waitingCountKorean!: number;

  @Column({ name: 'WAITING_FOR', default: 0 })
  waitingCountForeign!: number;

  @Column({ name: 'CONGESTION_LEVEL', length: 15 })
  congestionLevel!: string;

  @Column({ name: 'RECORDED_AT', type: 'timestamp' })
  recordedAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
