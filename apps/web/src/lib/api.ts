import axios from 'axios';
import { ApiResponse } from '@airport-app/types';
import { getToken } from './auth';

export type { FlightStatusEntity } from './types';

const http = axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_BASE_URL'] ?? 'http://localhost:3000/v1',
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
  fetchLogs: async (params?: { jobName?: string; limit?: number }) => {
    const { data } = await http.get('/admin/batch-logs', { params });
    return data;
  },
};

export const AdminAuthApi = {
  login: async (email: string, password: string): Promise<{ accessToken: string }> => {
    const { data } = await http.post<{ data: { accessToken: string } }>(
      '/admin/auth/login',
      { email, password },
    );
    return data.data;
  },
};
