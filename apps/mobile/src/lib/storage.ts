import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'airport-app-storage' });

export const StorageKeys = {
  DEVICE_ID: 'deviceId',
  DEFAULT_AIRPORT: 'defaultAirport',
  LANGUAGE: 'language',
  NOTIFICATION_ON: 'notificationOn',
} as const;

export function getDeviceId(): string | undefined {
  return storage.getString(StorageKeys.DEVICE_ID);
}

export function setDeviceId(id: string): void {
  storage.set(StorageKeys.DEVICE_ID, id);
}

export function getDefaultAirport(): string {
  return storage.getString(StorageKeys.DEFAULT_AIRPORT) ?? 'ICN';
}

export function setDefaultAirport(code: string): void {
  storage.set(StorageKeys.DEFAULT_AIRPORT, code);
}
