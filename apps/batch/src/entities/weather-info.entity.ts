import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('WEATHER_INFO')
export class WeatherInfoEntity {
  @PrimaryColumn({ name: 'WEATHER_ID', length: 100 })
  weatherId!: string;

  @Column({ name: 'AIRPORT_CODE', length: 10 })
  airportCode!: string;

  @Column({ name: 'CITY_NAME', length: 100, nullable: true })
  cityName?: string;

  @Column({ name: 'TEMPERATURE', type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature?: number;

  @Column({ name: 'FEELS_LIKE', type: 'decimal', precision: 5, scale: 2, nullable: true })
  feelsLike?: number;

  @Column({ name: 'HUMIDITY', nullable: true })
  humidity?: number;

  @Column({ name: 'WIND_SPEED', type: 'decimal', precision: 5, scale: 2, nullable: true })
  windSpeed?: number;

  @Column({ name: 'WEATHER_CODE', length: 50, nullable: true })
  weatherCode?: string;

  @Column({ name: 'WEATHER_ICON_URL', length: 200, nullable: true })
  weatherIconUrl?: string;

  @Column({ name: 'FORECAST_DATE', type: 'timestamp', nullable: true })
  forecastDate?: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}
