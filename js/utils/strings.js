/**
 * Copy a string to the clipboard with a DOM fallback.
 * @param {string} text - Text to copy.
 * @returns {Promise<void>} Resolves when copying succeeds.
 */
export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

/**
 * Highlight regex matches by wrapping them with a `<mark>` element.
 * @param {string} text - Source text to highlight.
 * @param {RegExp|string} regex - Pattern to highlight. Strings are converted to case-insensitive global regexes.
 * @returns {string} HTML string with safe highlighting applied.
 */
export function highlightMatches(text, regex) {
  if (!regex) return escapeHtml(text);
  const pattern = typeof regex === 'string' ? new RegExp(regex, 'gi') : regex;
  if (!(pattern instanceof RegExp)) {
    return escapeHtml(text);
  }
  const safeText = escapeHtml(text);
  const globalPattern = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  return safeText.replace(globalPattern, (match) => `<mark class="px-1 rounded-sm bg-zinc-500/30">${escapeHtml(match)}</mark>`);
}

/**
 * Format a byte value into a human-readable string.
 * @param {number} bytes - Number of bytes.
 * @returns {string} Formatted string such as `1.20 MB`.
 */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new Error('Byte size must be a non-negative finite number.');
  }
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Debounce a function call with cancellation support.
 * @template {(...args: any[]) => any} T
 * @param {T} fn - Function to debounce.
 * @param {number} [delay=220] - Delay in milliseconds.
 * @returns {T & { cancel: () => void }} Debounced function with `cancel` helper.
 */
export function debounce(fn, delay = 220) {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
    return timeout;
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = undefined;
  };
  return debounced;
}

/**
 * Escape HTML-reserved characters in a string.
 * @param {string} [text=''] - Text to escape.
 * @returns {string} Escaped string safe for injection in HTML.
 */
export function escapeHtml(text = '') {
  return text.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}
