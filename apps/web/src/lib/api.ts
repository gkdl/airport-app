import axios from 'axios';
import { ApiResponse } from '@airport-app/types';

export type { FlightStatusEntity } from './types';

const http = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_BASE_URL'] ?? 'http://localhost:3000/v1',
});

export interface FlightQueryDto {
  airportCode?: string;
  direction?: 'DEPARTURE' | 'ARRIVAL';
  terminal?: string;
  status?: string;
  flightNo?: string;
}

export const FlightApi = {
  fetchRealtime: async (query: FlightQueryDto) => {
    const { data } = await http.get<ApiResponse<import('./types').FlightStatusEntity[]>>(
      '/flights/realtime',
      { params: query },
    );
    return data;
  },
  fetchByFlightNo: async (flightNo: string) => {
    const { data } = await http.get<ApiResponse<import('./types').FlightStatusEntity>>(
      `/flights/${flightNo}`,
    );
    return data;
  },
};

export const ParkingApi = {
  fetchParking: async (params: { airportCode?: string; terminal?: string }) => {
    const { data } = await http.get('/parking', { params });
    return data;
  },
  fetchSummary: async (airportCode: string) => {
    const { data } = await http.get('/parking/summary', { params: { airportCode } });
    return data;
  },
};

export const ImmigrationApi = {
  fetchImmigration: async (params: {
    airportCode?: string;
    direction?: string;
    terminal?: string;
  }) => {
    const { data } = await http.get('/immigration', { params });
    return data;
  },
};

export const WeatherApi = {
  fetchWeather: async (airportCode: string) => {
    const { data } = await http.get('/weather', { params: { airportCode } });
    return data;
  },
};

export const BatchApi = {
  fetchLogs: async () => {
    const { data } = await http.get('/admin/batch-logs');
    return data;
  },
};
