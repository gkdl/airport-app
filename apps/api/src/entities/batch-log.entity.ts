import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('BATCH_LOG')
export class BatchLogEntity {
  @PrimaryGeneratedColumn({ name: 'LOG_ID' })
  logId!: number;

  @Column({ name: 'JOB_NAME', length: 100 })
  jobName!: string;

  @Column({ name: 'AIRPORT_CODE', length: 10, nullable: true })
  airportCode?: string;

  @Column({ name: 'STATUS', length: 10 })
  status!: string;

  @Column({ name: 'RECORDS_COUNT', default: 0 })
  recordsCount!: number;

  @Column({ name: 'ERROR_MESSAGE', length: 4000, nullable: true })
  errorMessage?: string;

  @Column({ name: 'STARTED_AT', type: 'timestamp' })
  startedAt!: Date;

  @Column({ name: 'FINISHED_AT', type: 'timestamp', nullable: true })
  finishedAt?: Date;

  @Column({ name: 'DURATION_MS', nullable: true })
  durationMs?: number;
}
