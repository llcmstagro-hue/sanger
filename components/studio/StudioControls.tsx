'use client';
import { useRef } from 'react';
import { useStudio } from '@/store/studioStore';
import { SPORT_ORDER, SPORTS } from '@/lib/sports';
import { track } from '@/lib/analytics';
import type { SportSlug } from '@/types';

const BASE = ['#15171B', '#E4141C', '#1D3A8F', '#0F5A3C', '#5A0E16', '#3A3D44'];
const ACCENT = ['#F4F3F0', '#E4141C', '#C9A24B', '#9AA0A9', '#111111', '#2563EB'];
const TEMPLATES = ['Классика', 'Полосы', 'Шеврон', 'Диагональ', 'Борта'];

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
      <span className="grid h-5 w-5 place-items-center rounded bg-paper2 text-red">{n}</span>
      {children}
    </div>
  );
}

export function StudioControls() {
  const s = useStudio();
  const fileRef = useRef<HTMLInputElement>(null);

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      s.setLogo(String(reader.result));
      track('logo_uploaded', {});
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label n="1">Вид спорта</Label>
        <div className="flex flex-wrap gap-2">
          {SPORT_ORDER.map((k: SportSlug) => (
            <button
              key={k}
              onClick={() => s.setSport(k)}
              aria-pressed={s.sport === k}
              className={`min-h-[38px] rounded-lg border px-3 font-sans text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                s.sport === k ? 'border-red bg-red text-white' : 'border-line2 text-ink2 hover:border-ink'
              }`}
            >
              {SPORTS[k].name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label n="2">Шаблон</Label>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t, i) => (
            <button
              key={t}
              onClick={() => {
                s.setTemplate(String(i));
                track('template_selected', { template: t });
              }}
              aria-pressed={s.template === String(i)}
              className={`min-h-[38px] rounded-lg border px-3 text-[12px] transition-colors ${
                s.template === String(i) ? 'border-red text-ink' : 'border-line2 text-muted hover:border-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label n="3">Основной цвет</Label>
        <div className="flex flex-wrap gap-2.5">
          {BASE.map((c) => (
            <button
              key={c}
              aria-label={`Цвет ${c}`}
              aria-pressed={s.baseColor === c}
              onClick={() => {
                s.setBase(c);
                track('color_changed', { role: 'base', color: c });
              }}
              className={`h-9 w-9 rounded-lg border transition-transform hover:-translate-y-0.5 ${
                s.baseColor === c ? 'outline outline-2 outline-offset-2 outline-ink' : 'border-line2'
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <Label n="4">Дополнительный цвет</Label>
        <div className="flex flex-wrap gap-2.5">
          {ACCENT.map((c) => (
            <button
              key={c}
              aria-label={`Акцент ${c}`}
              aria-pressed={s.accentColor === c}
              onClick={() => {
                s.setAccent(c);
                track('color_changed', { role: 'accent', color: c });
              }}
              className={`h-9 w-9 rounded-lg border transition-transform hover:-translate-y-0.5 ${
                s.accentColor === c ? 'outline outline-2 outline-offset-2 outline-ink' : 'border-line2'
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <Label n="5">Логотип</Label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="min-h-[44px] rounded-lg border border-line2 px-4 text-[13px] font-semibold text-ink hover:border-ink"
          >
            Загрузить логотип
          </button>
          {s.logo && (
            <button onClick={() => s.setLogo(null)} className="text-[12px] text-muted hover:text-red">
              Убрать
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="sr-only"
            onChange={onLogo}
            aria-label="Файл логотипа"
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_84px] gap-3">
        <div>
          <label htmlFor="st-surname" className="mb-2 block font-sans text-[10.5px] uppercase tracking-[0.14em] text-muted">
            Фамилия
          </label>
          <input
            id="st-surname"
            value={s.surname}
            maxLength={12}
            onChange={(e) => s.setSurname(e.target.value)}
            onBlur={() => track('surname_entered', {})}
            className="w-full rounded-lg border border-line2 bg-white px-3 py-3 text-[15px] text-ink focus:border-red focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="st-number" className="mb-2 block font-sans text-[10.5px] uppercase tracking-[0.14em] text-muted">
            Номер
          </label>
          <input
            id="st-number"
            value={s.number}
            inputMode="numeric"
            maxLength={2}
            onChange={(e) => s.setNumber(e.target.value)}
            onBlur={() => track('number_entered', {})}
            className="w-full rounded-lg border border-line2 bg-white px-3 py-3 text-[15px] text-ink focus:border-red focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
