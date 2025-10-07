const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('[storage] parse failed', error);
    return undefined;
  }
}

export const storage = {
  get(key) {
    if (!isBrowser) return undefined;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return undefined;
    return safeParse(raw);
  },
  set(key, value) {
    if (!isBrowser) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  }
};
