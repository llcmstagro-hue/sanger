import type { LeadInput } from './validation';

// Серверный помощник. Секреты берутся ТОЛЬКО из process.env и не покидают сервер.
export async function notifyTelegram(lead: LeadInput): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // В деве без токенов просто логируем — заявка всё равно принимается.
    console.info('[lead] TELEGRAM not configured, payload:', summarize(lead));
    return;
  }
  const text = formatMessage(lead);
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    throw new Error(`Telegram error: ${res.status}`);
  }
}

export async function notifyCrm(lead: LeadInput): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(summarize(lead)),
  });
}

function summarize(lead: LeadInput) {
  // Логотип-dataURL в лог/CRM не пишем целиком — только факт наличия.
  const { logo, ...rest } = lead;
  return { ...rest, hasLogo: Boolean(logo) };
}

function esc(s: string): string {
  return String(s).replace(/[<>&]/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[m]!));
}

function formatMessage(lead: LeadInput): string {
  const s = (lead.studio ?? {}) as Record<string, unknown>;
  const utm = lead.utm ?? {};
  const lines = [
    '🟥 <b>Новая заявка SANGER</b>',
    `Имя: <b>${esc(lead.name)}</b>`,
    `Телефон: <b>${esc(lead.phone)}</b>`,
    lead.email ? `Почта: ${esc(lead.email)}` : '',
    lead.city ? `Город: ${esc(lead.city)}` : '',
    `Вид спорта: ${esc(lead.sport)}`,
    `Комплектов: ${esc(lead.quantity)}`,
    lead.comment ? `Комментарий: ${esc(lead.comment)}` : '',
    lead.landing ? `Страница входа: ${esc(lead.landing)}` : '',
    s.template ? `Шаблон: ${esc(String(s.template))}` : '',
    s.baseColor ? `Цвета: ${esc(String(s.baseColor))} / ${esc(String(s.accentColor ?? ''))}` : '',
    s.surname ? `Фамилия/номер: ${esc(String(s.surname))} · ${esc(String(s.number ?? ''))}` : '',
    lead.logo ? 'Логотип: приложен' : '',
    Object.keys(utm).length
      ? `UTM: ${esc(Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(', '))}`
      : '',
  ].filter(Boolean);
  return lines.join('\n');
}
