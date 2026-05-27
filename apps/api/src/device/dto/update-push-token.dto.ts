import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePushTokenDto {
  @ApiProperty() @IsString()
  pushToken!: string;
}
