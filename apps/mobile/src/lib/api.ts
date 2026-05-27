import axios from 'axios';
import {
  ApiResponse,
  FlightStatus,
  ParkingStatus,
  ImmigrationStatus,
  WeatherInfo,
  Device,
  FavoriteFlight,
} from '@airport-app/types';

const http = axios.create({
  baseURL: process.env['EXPO_PUBLIC_API_BASE_URL'] ?? 'http://localhost:3000/v1',
  timeout: 10_000,
});

export const FlightApi = {
  getRealtime: (params: Record<string, string | undefined>) =>
    http.get<ApiResponse<FlightStatus[]>>('/flights/realtime', { params }).then((r) => r.data),
  getByFlightNo: (flightNo: string) =>
    http.get<ApiResponse<FlightStatus>>(`/flights/${flightNo}`).then((r) => r.data),
};

export const ParkingApi = {
  getList: (params: Record<string, string | undefined>) =>
    http.get<ApiResponse<ParkingStatus[]>>('/parking', { params }).then((r) => r.data),
  getSummary: (airportCode: string) =>
    http
      .get<ApiResponse<{ totalSpots: number; availableSpots: number; congestionLevel: string }>>(
        '/parking/summary',
        { params: { airportCode } },
      )
      .then((r) => r.data),
};

export const ImmigrationApi = {
  getList: (params: Record<string, string | undefined>) =>
    http.get<ApiResponse<ImmigrationStatus[]>>('/immigration', { params }).then((r) => r.data),
};

export const WeatherApi = {
  get: (airportCode: string) =>
    http
      .get<ApiResponse<WeatherInfo>>('/weather', { params: { airportCode } })
      .then((r) => r.data),
};

export const DeviceApi = {
  register: (body: { deviceId: string; platform: 'IOS' | 'ANDROID'; appVersion?: string }) =>
    http.post<ApiResponse<Device>>('/devices', body).then((r) => r.data),
  updatePushToken: (deviceId: string, pushToken: string) =>
    http
      .patch<ApiResponse<Device>>(`/devices/${deviceId}/push-token`, { pushToken })
      .then((r) => r.data),
  getFavorites: (deviceId: string) =>
    http
      .get<ApiResponse<FavoriteFlight[]>>(`/devices/${deviceId}/favorites`)
      .then((r) => r.data),
  addFavorite: (
    deviceId: string,
    body: Omit<FavoriteFlight, 'favoriteId' | 'deviceId' | 'createdAt'>,
  ) =>
    http
      .post<ApiResponse<FavoriteFlight>>(`/devices/${deviceId}/favorites`, body)
      .then((r) => r.data),
  removeFavorite: (deviceId: string, favoriteId: number) =>
    http.delete(`/devices/${deviceId}/favorites/${favoriteId}`).then((r) => r.data),
};
