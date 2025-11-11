import { describe, expect, it } from 'vitest';
import { convertToZone, diffInUnits, formatReadable, relativeTime, toIso } from '../../js/utils/dates.js';

describe('date utilities', () => {
  const sample = new Date(Date.UTC(2024, 0, 5, 13, 42, 0));

  it('produces ISO strings from various inputs', () => {
    expect(toIso(sample)).toBe('2024-01-05T13:42:00.000Z');
    expect(toIso('2024-01-05T13:42:00Z')).toBe('2024-01-05T13:42:00.000Z');
  });

  it('formats dates into readable UTC strings', () => {
    expect(formatReadable(sample)).toBe('Jan 05 2024 — 13:42 UTC');
  });

  it('computes relative time phrases', () => {
    const base = new Date(Date.UTC(2024, 0, 5, 11, 42, 0));
    expect(relativeTime(sample, base)).toBe('in 2 hours');
  });

  it('converts dates to specific zones or throws', () => {
    expect(convertToZone(sample, 'UTC')).toContain('Jan');
    expect(() => convertToZone(sample, 'Invalid/Zone')).toThrow('Unsupported time zone');
  });

  it('calculates differences across units', () => {
    const later = new Date(sample.getTime() + 3600 * 1000);
    expect(diffInUnits(sample, later)).toMatchObject({
      ms: 3600000,
      seconds: 3600,
      minutes: 60,
      hours: 1,
      days: 0.04
    });
  });
});
