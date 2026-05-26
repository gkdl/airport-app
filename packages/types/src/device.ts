export interface Device {
  deviceId: string;
  pushToken: string | null;
  platform: 'IOS' | 'ANDROID';
  appVersion: string;
  notificationOn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteFlight {
  favoriteId: number;
  deviceId: string;
  flightNo: string;
  airportCode: string;
  direction: 'DEPARTURE' | 'ARRIVAL';
  notifyDelay: boolean;
  notifyCancel: boolean;
  notifyBoarding: boolean;
  createdAt: Date;
}
