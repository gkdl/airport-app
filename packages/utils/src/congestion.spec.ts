import { CongestionLevel } from '@airport-app/types';
import { calcCongestionLevel, calcOccupancyRate } from './congestion';

describe('calcCongestionLevel', () => {
  it('returns FULL when total is 0', () => {
    expect(calcCongestionLevel(0, 0)).toBe(CongestionLevel.FULL);
  });

  it('returns AVAILABLE when ratio < 0.7', () => {
    expect(calcCongestionLevel(69, 100)).toBe(CongestionLevel.AVAILABLE);
    expect(calcCongestionLevel(0, 100)).toBe(CongestionLevel.AVAILABLE);
  });

  it('returns NORMAL when ratio is 0.7–0.84', () => {
    expect(calcCongestionLevel(70, 100)).toBe(CongestionLevel.NORMAL);
    expect(calcCongestionLevel(84, 100)).toBe(CongestionLevel.NORMAL);
  });

  it('returns CONGESTED when ratio is 0.85–0.94', () => {
    expect(calcCongestionLevel(85, 100)).toBe(CongestionLevel.CONGESTED);
    expect(calcCongestionLevel(94, 100)).toBe(CongestionLevel.CONGESTED);
  });

  it('returns FULL when ratio >= 0.95', () => {
    expect(calcCongestionLevel(95, 100)).toBe(CongestionLevel.FULL);
    expect(calcCongestionLevel(100, 100)).toBe(CongestionLevel.FULL);
  });
});

describe('calcOccupancyRate', () => {
  it('returns 100 when total is 0', () => {
    expect(calcOccupancyRate(0, 0)).toBe(100);
  });

  it('calculates percentage correctly', () => {
    expect(calcOccupancyRate(50, 100)).toBe(50);
    expect(calcOccupancyRate(1, 3)).toBe(33);
    expect(calcOccupancyRate(2, 3)).toBe(67);
  });
});
