import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty() @IsString()
  deviceId!: string;

  @ApiProperty({ enum: ['IOS', 'ANDROID'] })
  @IsEnum(['IOS', 'ANDROID'])
  platform!: 'IOS' | 'ANDROID';

  @ApiPropertyOptional() @IsOptional() @IsString()
  appVersion?: string;
}
