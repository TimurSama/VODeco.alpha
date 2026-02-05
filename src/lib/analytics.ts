type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

type UTMFields = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const UTM_STORAGE_KEY = 'vodeco_utm';
const UTM_KEYS: Array<keyof UTMFields> = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

function readStoredUtm(): UTMFields {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UTMFields;
  } catch {
    return {};
  }
}

function persistUtm(utm: UTMFields) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // ignore storage errors
  }
}

export function captureUtmFromUrl(): UTMFields {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const existing = readStoredUtm();
  const next: UTMFields = { ...existing };
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) next[key] = value;
  });
  persistUtm(next);
  return next;
}

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;
  const utm = captureUtmFromUrl();
  const eventPayload = { ...utm, ...payload };
  if (window.gtag) {
    window.gtag('event', event, eventPayload);
    return;
  }
  if (window.dataLayer) {
    window.dataLayer.push({ event, ...eventPayload });
    return;
  }
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true') {
    // eslint-disable-next-line no-console
    console.log('[analytics]', event, eventPayload);
  }
}

