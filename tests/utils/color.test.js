import { describe, expect, it } from 'vitest';
import { blend, contrastRatio, hexToRgb, relativeLuminance } from '../../js/utils/color.js';

describe('color utilities', () => {
  it('converts hex to rgb values', () => {
    expect(hexToRgb('#336699')).toEqual({ r: 51, g: 102, b: 153 });
    expect(hexToRgb('fff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('throws for invalid hex strings', () => {
    expect(() => hexToRgb('zzzzzz')).toThrow('Invalid hex color');
  });

  it('calculates relative luminance according to WCAG', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
  });

  it('computes contrast ratio between colors', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21);
    expect(contrastRatio('#ffffff', '#ffffff')).toBe(1);
  });

  it('blends colors with ratio bounds validation', () => {
    expect(blend('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(() => blend('#000000', '#ffffff', 2)).toThrow('Blend ratio');
  });
});
