import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FlightStatusCode } from '@airport-app/types';

export class FlightQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  airportCode?: string;

  @ApiPropertyOptional({ enum: ['DEPARTURE', 'ARRIVAL'] })
  @IsOptional() @IsEnum(['DEPARTURE', 'ARRIVAL'])
  direction?: 'DEPARTURE' | 'ARRIVAL';

  @ApiPropertyOptional() @IsOptional() @IsString()
  terminal?: string;

  @ApiPropertyOptional({ enum: FlightStatusCode })
  @IsOptional() @IsEnum(FlightStatusCode)
  status?: FlightStatusCode;

  @ApiPropertyOptional() @IsOptional() @IsString()
  flightNo?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional() @IsString()
  date?: string;
}
