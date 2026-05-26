import { CongestionLevel } from '@airport-app/types';

export function calcCongestionLevel(occupied: number, total: number): CongestionLevel {
  if (total === 0) return CongestionLevel.FULL;
  const ratio = occupied / total;
  if (ratio < 0.7) return CongestionLevel.AVAILABLE;
  if (ratio < 0.85) return CongestionLevel.NORMAL;
  if (ratio < 0.95) return CongestionLevel.CONGESTED;
  return CongestionLevel.FULL;
}

export function calcOccupancyRate(occupied: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((occupied / total) * 100);
}
