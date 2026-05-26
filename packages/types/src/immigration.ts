import { CongestionLevel } from './parking';

export interface ImmigrationStatus {
  immigrationId: string;
  airportCode: string;
  terminal: string;
  direction: 'ARRIVAL' | 'DEPARTURE';
  gate: string;
  waitingCount: number;
  waitingCountKorean?: number;
  waitingCountForeign?: number;
  congestionLevel: CongestionLevel;
  recordedAt: Date;
  updatedAt: Date;
}

export interface ImmigrationQuery {
  airportCode?: string;
  terminal?: string;
  direction?: 'ARRIVAL' | 'DEPARTURE';
}
