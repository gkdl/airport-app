import { FlightQuery, ImmigrationQuery } from '@airport-app/types';

export const queryKeys = {
  flights: {
    realtime: (params: FlightQuery) => ['flights', 'realtime', params] as const,
    schedule: (params: FlightQuery) => ['flights', 'schedule', params] as const,
    detail:   (flightNo: string)    => ['flights', 'detail', flightNo] as const,
  },
  parking: {
    list:    (airportCode: string) => ['parking', airportCode] as const,
    summary: (airportCode: string) => ['parking', 'summary', airportCode] as const,
  },
  immigration: {
    list: (params: ImmigrationQuery) => ['immigration', params] as const,
  },
  weather: {
    byAirport: (airportCode: string) => ['weather', airportCode] as const,
  },
  favorites: {
    list: (deviceId: string) => ['favorites', deviceId] as const,
  },
};
