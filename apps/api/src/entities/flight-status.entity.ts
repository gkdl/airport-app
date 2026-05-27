import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('FLIGHT_STATUS')
export class FlightStatusEntity {
  @PrimaryColumn({ name: 'FLIGHT_ID', length: 100 })
  flightId!: string;

  @PrimaryColumn({ name: 'FLIGHT_DATE', type: 'date' })
  flightDate!: Date;

  @Column({ name: 'AIRPORT_CODE', length: 10 })
  airportCode!: string;

  @Column({ name: 'AIRPORT_TYPE', length: 10 })
  airportType!: string;

  @Column({ name: 'AIRLINE', length: 100, nullable: true })
  airline?: string;

  @Column({ name: 'FLIGHT_NO', length: 20 })
  flightNo!: string;

  @Column({ name: 'MASTER_FLIGHT_NO', length: 20, nullable: true })
  masterFlightNo?: string;

  @Column({ name: 'IS_CODESHARE', default: 0 })
  isCodeshare!: number;

  @Column({ name: 'DIRECTION', length: 15 })
  direction!: string;

  @Column({ name: 'TERMINAL', length: 10, nullable: true })
  terminal?: string;

  @Column({ name: 'GATE', length: 10, nullable: true })
  gate?: string;

  @Column({ name: 'SCHEDULED_TIME', type: 'timestamp' })
  scheduledTime!: Date;

  @Column({ name: 'ESTIMATED_TIME', type: 'timestamp', nullable: true })
  estimatedTime?: Date;

  @Column({ name: 'ACTUAL_TIME', type: 'timestamp', nullable: true })
  actualTime?: Date;

  @Column({ name: 'STATUS', length: 20 })
  status!: string;

  @Column({ name: 'ORIGIN', length: 10, nullable: true })
  origin?: string;

  @Column({ name: 'DESTINATION', length: 10, nullable: true })
  destination?: string;

  @Column({ name: 'BAGGAGE_CLAIM', length: 10, nullable: true })
  baggageClaim?: string;

  @Column({ name: 'EXIT_GATE', length: 10, nullable: true })
  exitGate?: string;

  @Column({ name: 'VIA', length: 10, nullable: true })
  via?: string;

  @Column({ name: 'FLIGHT_TYPE', length: 15, nullable: true })
  flightType?: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
