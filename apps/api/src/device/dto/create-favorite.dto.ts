import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty() @IsString()
  flightNo!: string;

  @ApiProperty() @IsString()
  airportCode!: string;

  @ApiProperty({ enum: ['DEPARTURE', 'ARRIVAL'] })
  @IsEnum(['DEPARTURE', 'ARRIVAL'])
  direction!: 'DEPARTURE' | 'ARRIVAL';

  @ApiPropertyOptional() @IsOptional() @IsBoolean()
  notifyDelay?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsBoolean()
  notifyCancel?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsBoolean()
  notifyBoarding?: boolean;
}
