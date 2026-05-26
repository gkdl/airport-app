export interface WeatherInfo {
  weatherId: string;
  airportCode: string;
  cityName: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: string;
  weatherIconUrl: string;
  forecastDate: Date;
  updatedAt: Date;
}
