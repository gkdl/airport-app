import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('NOTIFICATION_LOG')
export class NotificationLogEntity {
  @PrimaryGeneratedColumn({ name: 'LOG_ID' })
  logId!: number;

  @Column({ name: 'DEVICE_ID', length: 100 })
  deviceId!: string;

  @Column({ name: 'FLIGHT_NO', length: 20 })
  flightNo!: string;

  @Column({ name: 'NOTIFY_TYPE', length: 20 })
  notifyType!: string;

  @Column({ name: 'TITLE', length: 200, nullable: true })
  title?: string;

  @Column({ name: 'BODY', length: 500, nullable: true })
  body?: string;

  @Column({ name: 'IS_SENT', default: 0 })
  isSent!: number;

  @Column({ name: 'SENT_AT', type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ name: 'ERROR_MSG', length: 1000, nullable: true })
  errorMsg?: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;
}
