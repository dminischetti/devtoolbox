const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function toIso(date = new Date()) {
  return date.toISOString();
}

export function formatReadable(date = new Date()) {
  return `${MONTHS[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, '0')} ${date.getUTCFullYear()} — ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')} UTC`;
}

export function relativeTime(date, base = new Date()) {
  const diff = date - base;
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

export function listTimezones() {
  const zones = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['UTC'];
  return zones;
}

export function convertToZone(date, zone = 'UTC') {
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
    }).format(date);
  } catch (error) {
    return 'Invalid time zone';
  }
}

export function diffInUnits(start, end) {
  const ms = end - start;
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
