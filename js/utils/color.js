const HEX_PATTERN = /^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function normalizeHex(hex) {
  if (!HEX_PATTERN.test(hex)) {
    throw new Error('Invalid hex color. Expected a 3 or 6 digit value.');
  }
  return hex.startsWith('#') ? hex : `#${hex}`;
}

/**
 * Convert a color channel to its WCAG relative luminance component.
 * The constants derive from the WCAG 2.1 contrast formula where
 * values below 0.03928 represent the linear section and the remainder
 * follow a gamma correction curve (2.4) to approximate human perception.
 * @param {number} channel - RGB channel value in the range 0-255.
 * @returns {number} Linearized luminance component.
 */
function luminanceComponent(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculate the WCAG relative luminance for a color.
 * @param {string} hex - Color in hex format (#RRGGBB or #RGB).
 * @returns {number} Relative luminance between 0 (black) and 1 (white).
 * @throws {Error} When the provided hex value is invalid.
 */
export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map(luminanceComponent);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Compute the WCAG contrast ratio between two colors.
 * @param {string} hexA - First color in hex format.
 * @param {string} hexB - Second color in hex format.
 * @returns {number} Contrast ratio rounded to two decimals (1-21).
 * @throws {Error} When either color is invalid.
 */
export function contrastRatio(hexA, hexB) {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

/**
 * Convert a hex color string to its RGB components.
 * @param {string} hex - Hex color (#RGB or #RRGGBB).
 * @returns {{r: number, g: number, b: number}} RGB object with 0-255 values.
 * @throws {Error} When the provided hex value is invalid.
 */
export function hexToRgb(hex) {
  const normalized = normalizeHex(hex).slice(1);
  const bigint = parseInt(normalized, 16);
  if (normalized.length === 3) {
    const r = ((bigint >> 8) & 0xf) * 17;
    const g = ((bigint >> 4) & 0xf) * 17;
    const b = (bigint & 0xf) * 17;
    return { r, g, b };
  }
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * Recommend a legible text color against a background.
 * @param {string} bgHex - Background color in hex format.
 * @returns {string} Either '#000000' or '#ffffff'.
 */
export function recommendTextColor(bgHex) {
  return contrastRatio(bgHex, '#000000') >= 4.5 ? '#000000' : '#ffffff';
}

/**
 * Blend two hex colors using linear interpolation.
 * @param {string} hexA - First color in hex format.
 * @param {string} hexB - Second color in hex format.
 * @param {number} [ratio=0.5] - Blend ratio (0-1) where 0 is hexA and 1 is hexB.
 * @returns {string} Hex color representing the blended value.
 * @throws {Error} When colors are invalid or ratio is out of bounds.
 */
export function blend(hexA, hexB, ratio = 0.5) {
  if (Number.isNaN(ratio) || ratio < 0 || ratio > 1) {
    throw new Error('Blend ratio must be between 0 and 1.');
  }
  const rgbA = hexToRgb(hexA);
  const rgbB = hexToRgb(hexB);
  const mix = {
    r: Math.round(rgbA.r * (1 - ratio) + rgbB.r * ratio),
    g: Math.round(rgbA.g * (1 - ratio) + rgbB.g * ratio),
    b: Math.round(rgbA.b * (1 - ratio) + rgbB.b * ratio)
  };
  return `#${((1 << 24) + (mix.r << 16) + (mix.g << 8) + mix.b).toString(16).slice(1)}`;
}
