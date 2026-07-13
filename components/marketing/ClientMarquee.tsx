'use client';
import { useReducedMotion } from 'framer-motion';

// Бесконечная лента клиентских клубов — усиливает «работаем с сотнями команд».
// Названия — клиентские (НЕ SANGER). Чистая CSS-анимация, дублируем список для
// бесшовной петли; на prefers-reduced-motion лента статична.
const CLUBS = [
  'МЕТЕОР', 'ТИТАН', 'ВЫСОТА', 'ФЕНИКС', 'ЛЕГИОН', 'БАРС', 'ГРОЗА', 'СПАРТА',
  'ВОЛНА', 'ЯСТРЕБЫ', 'АВРОРА', 'КОМЕТА', 'ОНИКС', 'ВИХРЬ', 'ХИЩНИК', 'ЯРОСТЬ',
];

export function ClientMarquee({ label = 'Уже работаем с сотнями команд' }: { label?: string }) {
  const reduce = useReducedMotion();
  const row = [...CLUBS, ...CLUBS];
  return (
    <section className="border-y border-line bg-white py-10 sm:py-12" aria-label="Клиенты SANGER">
      <p className="mb-6 text-center font-sans text-[11px] uppercase tracking-[0.22em] text-muted">{label}</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div
          className={`flex w-max items-center gap-12 whitespace-nowrap ${reduce ? '' : 'animate-marquee'}`}
        >
          {row.map((c, i) => (
            <span
              key={i}
              className="font-display text-[26px] font-black uppercase tracking-tight text-ink/12 transition-colors sm:text-[34px]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
