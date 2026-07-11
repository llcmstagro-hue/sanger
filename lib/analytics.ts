// Обёртка над Яндекс.Метрикой. Все события проекта — в одном месте.
export type YmEvent =
  | 'sport_page_view'
  | 'create_form_click'
  | 'studio_open'
  | 'template_selected'
  | 'color_changed'
  | 'logo_uploaded'
  | 'surname_entered'
  | 'number_entered'
  | 'estimate_form_open'
  | 'lead_submit'
  | 'lead_success'
  | 'phone_click'
  | 'messenger_click';

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

function ymId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YM_ID;
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function track(event: YmEvent, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const id = ymId();
  // Дедупликация «шумных» событий (например color_changed) — не чаще раза в 400мс
  try {
    if (id && typeof window.ym === 'function') {
      window.ym(id, 'reachGoal', event, params);
    }
    // Дублируем в dataLayer-подобный буфер для отладки без Метрики
    (window as unknown as { __sangerEvents?: unknown[] }).__sangerEvents ??= [];
    (window as unknown as { __sangerEvents: unknown[] }).__sangerEvents.push({
      event,
      params,
      t: Date.now(),
    });
  } catch {
    /* никогда не роняем UI из-за аналитики */
  }
}
