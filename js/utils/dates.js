const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ensureDate(value = new Date()) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date value supplied.');
  }
  return parsed;
}

/**
 * Convert a value to an ISO 8601 timestamp.
 * @param {Date|number|string} [date=new Date()] - Input date value.
 * @returns {string} ISO timestamp.
 * @throws {Error} When the date cannot be parsed.
 */
export function toIso(date = new Date()) {
  return ensureDate(date).toISOString();
}

/**
 * Format a date into a terse, human-readable UTC string.
 * Example output: `Jan 05 2024 — 13:42 UTC`.
 * @param {Date|number|string} [date=new Date()] - Input date value.
 * @returns {string} Human readable representation.
 * @throws {Error} When the date cannot be parsed.
 */
export function formatReadable(date = new Date()) {
  const safeDate = ensureDate(date);
  return `${MONTHS[safeDate.getUTCMonth()]} ${String(safeDate.getUTCDate()).padStart(2, '0')} ${safeDate.getUTCFullYear()} — ${String(safeDate.getUTCHours()).padStart(2, '0')}:${String(safeDate.getUTCMinutes()).padStart(2, '0')} UTC`;
}

/**
 * Provide a relative time description between two dates.
 * @param {Date|number|string} date - Target date.
 * @param {Date|number|string} [base=new Date()] - Baseline date.
 * @returns {string} Relative time phrase such as "in 2 hours".
 * @throws {Error} When either date cannot be parsed.
 */
export function relativeTime(date, base = new Date()) {
  const safeDate = ensureDate(date);
  const safeBase = ensureDate(base);
  const diff = safeDate - safeBase;
  const minutes = Math.round(diff / 60000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const abs = Math.abs(minutes);
  if (abs < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(diff / 3600000);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  const days = Math.round(diff / 86400000);
  if (Math.abs(days) < 7) return rtf.format(days, 'day');
  const weeks = Math.round(diff / (86400000 * 7));
  return rtf.format(weeks, 'week');
}

/**
 * List supported IANA time zones for the current runtime.
 * @returns {string[]} Array of time zone identifiers.
 */
export function listTimezones() {
  const zones = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['UTC'];
  return [...zones];
}

/**
 * Format a date for a specific time zone using a consistent template.
 * @param {Date|number|string} date - Input date value.
 * @param {string} [zone='UTC'] - IANA time zone identifier.
 * @returns {string} Formatted date-time string.
 * @throws {Error} When the date is invalid or the zone is unsupported.
 */
export function convertToZone(date, zone = 'UTC') {
  const safeDate = ensureDate(date);
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour12: false,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(safeDate);
  } catch (error) {
    throw new Error(`Unsupported time zone: ${zone}`);
  }
}

/**
 * Calculate the delta between two dates in multiple units.
 * @param {Date|number|string} start - Starting date.
 * @param {Date|number|string} end - Ending date.
 * @returns {{ms: number, seconds: number, minutes: number, hours: number, days: number}}
 * Object containing rounded durations.
 * @throws {Error} When either date cannot be parsed.
 */
export function diffInUnits(start, end) {
  const safeStart = ensureDate(start);
  const safeEnd = ensureDate(end);
  const ms = safeEnd - safeStart;
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  return {
    ms,
    seconds: Number(seconds.toFixed(2)),
    minutes: Number(minutes.toFixed(2)),
    hours: Number(hours.toFixed(2)),
    days: Number(days.toFixed(2))
  };
}
