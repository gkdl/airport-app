import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ParkingQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  airportCode?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  terminal?: string;

  @ApiPropertyOptional({ enum: ['SHORT', 'LONG', 'TOWER'] })
  @IsOptional() @IsEnum(['SHORT', 'LONG', 'TOWER'])
  parkingType?: string;
}
