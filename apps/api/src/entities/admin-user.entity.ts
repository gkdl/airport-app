import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ADMIN_USER')
export class AdminUserEntity {
  @PrimaryColumn({ name: 'ADMIN_ID', length: 100 })
  adminId!: string;

  @Column({ name: 'EMAIL', length: 200, unique: true })
  email!: string;

  @Column({ name: 'PASSWORD_HASH', length: 255 })
  passwordHash!: string;

  @Column({ name: 'NAME', length: 100, nullable: true })
  name?: string;

  @Column({ name: 'ROLE', length: 20, default: 'ADMIN' })
  role!: string;

  @Column({ name: 'IS_ACTIVE', default: 1 })
  isActive!: number;

  @Column({ name: 'LAST_LOGIN_AT', type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
