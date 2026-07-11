// Генератор SVG формы (front/back) для Студии дизайна и галереи.
// Framework-agnostic: возвращает строку SVG. Логика проверена визуально.

export interface JerseyOptions {
  base: string;
  accent: string;
  template?: string; // jersey | kit | singlet | rashguard
  pattern?: number; // 0..4
  logo?: string | null; // dataURL
  surname?: string;
  number?: string;
  side?: 'front' | 'back';
  id?: string;
}

function hexToRgb(h: string): [number, number, number] {
  const c = h.replace('#', '');
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}
function isDark(h: string): boolean {
  const [r, g, b] = hexToRgb(h);
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}
function shade(h: string, p: number): string {
  const [r, g, b] = hexToRgb(h);
  const f = (t: number) => Math.max(0, Math.min(255, Math.round(t + p * 2.55)));
  return (
    '#' +
    [f(r), f(g), f(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}
function esc(s: string): string {
  return String(s).replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]!));
}

export function jerseySvg(o: JerseyOptions): string {
  const base = o.base;
  const accent = o.accent;
  const ink = isDark(base) ? accent : '#111111';
  const st = shade(base, isDark(base) ? 16 : -14);
  const id = o.id || 'j';
  const pid = id + 'p';
  const pattern = o.pattern ?? 2;
  const side = o.side ?? 'front';

  let defs = '';
  if (pattern === 1) {
    defs = `<pattern id="${pid}" width="24" height="10" patternUnits="userSpaceOnUse"><rect width="24" height="10" fill="${base}"/><rect width="9" height="10" fill="${st}"/></pattern>`;
  } else if (pattern === 2) {
    defs = `<pattern id="${pid}" width="40" height="26" patternUnits="userSpaceOnUse"><rect width="40" height="26" fill="${base}"/><path d="M0 20 20 6 40 20 40 26 20 12 0 26Z" fill="${st}"/></pattern>`;
  } else if (pattern === 3) {
    defs = `<pattern id="${pid}" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><rect width="18" height="18" fill="${base}"/><rect width="8" height="18" fill="${st}"/></pattern>`;
  } else if (pattern === 4) {
    defs = `<linearGradient id="${pid}" x1="0" x2="1"><stop offset="0" stop-color="${st}"/><stop offset=".18" stop-color="${base}"/><stop offset=".82" stop-color="${base}"/><stop offset="1" stop-color="${st}"/></linearGradient>`;
  } else {
    defs = `<linearGradient id="${pid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(base, 9)}"/><stop offset="1" stop-color="${shade(base, -7)}"/></linearGradient>`;
  }

  const body =
    'M100 46C118 66 182 66 200 46L248 46 296 108 250 154 238 134 238 312Q238 326 224 326L76 326Q62 326 62 312L62 134 50 154 4 108 52 46Z';

  let content = '';
  if (side === 'back') {
    content =
      `<rect x="66" y="146" width="168" height="34" rx="3" fill="${ink}" opacity=".12"/>` +
      `<text x="150" y="172" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="800" font-size="25" letter-spacing="2" fill="${ink}">${esc((o.surname || '').toUpperCase())}</text>` +
      `<text x="150" y="278" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="104" letter-spacing="-2" fill="${ink}">${esc(o.number || '')}</text>`;
  } else {
    const logo = o.logo
      ? `<image href="${o.logo}" x="118" y="150" width="64" height="64" preserveAspectRatio="xMidYMid meet"/>`
      : `<text x="150" y="186" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="30" letter-spacing="4" fill="${ink}">SANGER</text>`;
    content =
      logo +
      `<text x="150" y="272" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="60" fill="${ink}">${esc(o.number || '')}</text>`;
  }

  return (
    `<svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Форма ${esc(o.surname || '')} ${esc(o.number || '')}">` +
    `<defs>${defs}</defs>` +
    `<path d="M52 46 4 108 50 154 62 128Z" fill="${shade(base, -16)}"/>` +
    `<path d="M248 46 296 108 250 154 238 128Z" fill="${shade(base, -16)}"/>` +
    `<path d="${body}" fill="url(#${pid})" stroke="rgba(0,0,0,.28)" stroke-width="1.4"/>` +
    `<path d="M100 46C118 66 182 66 200 46L192 62C174 80 126 80 108 62Z" fill="${accent}"/>` +
    `<rect x="6" y="146" width="46" height="8" rx="1" transform="rotate(-42 30 150)" fill="${accent}"/>` +
    `<rect x="248" y="146" width="46" height="8" rx="1" transform="rotate(42 270 150)" fill="${accent}"/>` +
    content +
    `</svg>`
  );
}
