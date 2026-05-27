import { calcDelayMinutes, toKstIsoString } from './date';

describe('calcDelayMinutes', () => {
  it('returns 0 when actual is null', () => {
    expect(calcDelayMinutes('2024-01-01T10:00:00Z', null)).toBe(0);
  });

  it('returns 0 when no delay', () => {
    expect(calcDelayMinutes('2024-01-01T10:00:00Z', '2024-01-01T10:00:00Z')).toBe(0);
  });

  it('calculates delay in minutes', () => {
    expect(calcDelayMinutes('2024-01-01T10:00:00Z', '2024-01-01T10:30:00Z')).toBe(30);
  });

  it('returns 0 for early arrivals (no negative delay)', () => {
    expect(calcDelayMinutes('2024-01-01T10:30:00Z', '2024-01-01T10:00:00Z')).toBe(0);
  });
});

describe('toKstIsoString', () => {
  it('adds +09:00 offset', () => {
    const d = new Date('2024-01-01T00:00:00.000Z');
    expect(toKstIsoString(d)).toBe('2024-01-01T09:00:00.000+09:00');
  });
});
