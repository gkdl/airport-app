export enum CongestionLevel {
  AVAILABLE = 'AVAILABLE',
  NORMAL    = 'NORMAL',
  CONGESTED = 'CONGESTED',
  FULL      = 'FULL',
}

export interface ParkingStatus {
  parkingId: string;
  airportCode: string;
  airportType: 'INCHEON' | 'KAC';
  zone: string;
  terminal: string | null;
  parkingType: 'SHORT' | 'LONG' | 'TOWER';
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  congestionLevel: CongestionLevel;
  recordedAt: Date;
  updatedAt: Date;
}
