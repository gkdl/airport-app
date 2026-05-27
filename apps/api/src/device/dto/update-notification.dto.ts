import { IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @IsBoolean()
  notificationOn!: boolean;
}
