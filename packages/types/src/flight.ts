export enum FlightStatusCode {
  SCHEDULED = 'SCHEDULED',
  DELAYED   = 'DELAYED',
  CANCELLED = 'CANCELLED',
  DEPARTED  = 'DEPARTED',
  ARRIVED   = 'ARRIVED',
  BOARDING  = 'BOARDING',
  DIVERTED  = 'DIVERTED',
  LANDED    = 'LANDED',
}

export interface FlightStatus {
  flightId: string;
  airportCode: string;
  airportType: 'INCHEON' | 'KAC';
  airline: string;
  flightNo: string;
  masterFlightNo: string | null;
  isCodeshare: boolean;
  direction: 'DEPARTURE' | 'ARRIVAL';
  terminal: string;
  gate: string | null;
  scheduledTime: Date;
  estimatedTime: Date | null;
  actualTime: Date | null;
  status: FlightStatusCode;
  origin: string;
  destination: string;
  baggageClaim: string | null;
  exitGate: string | null;
  via: string | null;
  flightType: 'INTERNATIONAL' | 'DOMESTIC';
  createdAt: Date;
  updatedAt: Date;
}

export interface FlightSchedule {
  scheduleId: string;
  airportCode: string;
  airline: string;
  flightNo: string;
  direction: 'DEPARTURE' | 'ARRIVAL';
  operatingDays: string;
  seasonCode: string;
  seasonStart: Date;
  seasonEnd: Date;
  origin: string;
  destination: string;
  scheduledTime: string;
  updatedAt: Date;
}

export interface FlightQuery {
  airportCode?: string;
  direction?: 'DEPARTURE' | 'ARRIVAL';
  terminal?: string;
  status?: FlightStatusCode;
  flightNo?: string;
  date?: string;
}
