function luminanceComponent(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map(luminanceComponent);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(hexA, hexB) {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

export function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
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

export function recommendTextColor(bgHex) {
  return contrastRatio(bgHex, '#000000') >= 4.5 ? '#000000' : '#ffffff';
}

export function blend(hexA, hexB, ratio = 0.5) {
  const rgbA = hexToRgb(hexA);
  const rgbB = hexToRgb(hexB);
  const mix = {
    r: Math.round(rgbA.r * (1 - ratio) + rgbB.r * ratio),
    g: Math.round(rgbA.g * (1 - ratio) + rgbB.g * ratio),
    b: Math.round(rgbA.b * (1 - ratio) + rgbB.b * ratio)
  };
  return `#${((1 << 24) + (mix.r << 16) + (mix.g << 8) + mix.b).toString(16).slice(1)}`;
}
