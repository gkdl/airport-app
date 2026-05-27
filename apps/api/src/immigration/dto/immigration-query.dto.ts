import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ImmigrationQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  airportCode?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  terminal?: string;

  @ApiPropertyOptional({ enum: ['ARRIVAL', 'DEPARTURE'] })
  @IsOptional() @IsEnum(['ARRIVAL', 'DEPARTURE'])
  direction?: 'ARRIVAL' | 'DEPARTURE';
}
