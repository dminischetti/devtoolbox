import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce, escapeHtml, formatBytes, highlightMatches } from '../../js/utils/strings.js';

describe('string utilities', () => {
  describe('highlightMatches', () => {
    it('wraps matches safely', () => {
      const result = highlightMatches('<tag>hello</tag>', /hello/gi);
      expect(result).toContain('&lt;tag&gt;');
      expect(result).toContain('<mark');
    });

    it('falls back to escaped text without regex', () => {
      expect(highlightMatches('<tag>', null)).toBe('&lt;tag&gt;');
    });
  });

  describe('formatBytes', () => {
    it('formats values into human readable units', () => {
      expect(formatBytes(1024)).toBe('1.00 KB');
      expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
    });

    it('guards against invalid numbers', () => {
      expect(() => formatBytes(-1)).toThrow('Byte size');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays execution and allows cancellation', () => {
      const spy = vi.fn();
      const debounced = debounce(spy, 200);
      debounced('first');
      vi.advanceTimersByTime(199);
      expect(spy).not.toHaveBeenCalled();
      debounced.cancel();
      vi.advanceTimersByTime(10);
      expect(spy).not.toHaveBeenCalled();
      debounced('second');
      vi.advanceTimersByTime(200);
      expect(spy).toHaveBeenCalledWith('second');
    });
  });

  it('escapes HTML entities', () => {
    expect(escapeHtml(`"&'<`)).toBe('&quot;&amp;&#39;&lt;');
  });
});
