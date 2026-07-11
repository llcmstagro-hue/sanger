// Захват и хранение UTM-меток на протяжении всей сессии.
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
  'gclid',
] as const;

const STORAGE_KEY = 'sanger_utm';

export function captureUtm(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) found[k] = v;
    });
    if (Object.keys(found).length > 0) {
      const existing = getUtm();
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...existing, ...found }),
      );
    }
  } catch {
    /* приватный режим / storage недоступен — игнорируем */
  }
}

export function getUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}
