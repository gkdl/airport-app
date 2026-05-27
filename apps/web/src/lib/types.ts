export interface FlightStatusEntity {
  flightId: string;
  flightNo: string;
  airline?: string;
  destination?: string;
  origin?: string;
  scheduledTime: string;
  estimatedTime?: string;
  gate?: string;
  status: string;
}
