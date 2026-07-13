import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';

const ITEMS = [
  { t: 'Индивидуальный дизайн', d: 'Уникальный стиль и символика вашей команды' },
  { t: 'Собственное производство', d: 'Полный цикл и контроль качества под одной крышей' },
  { t: 'Заказ от 5 комплектов', d: 'Выгодные условия даже для небольшой команды' },
  { t: 'Доставка по России', d: 'Быстро и надёжно в любой регион страны' },
  { t: 'Помощь дизайнера', d: 'Бесплатно доработаем ваш макет до идеала' },
];

function Ic({ i }: { i: number }) {
  const paths = [
    'M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17.9l.9-5.4L4.2 8.7l5.4-.8L12 3Z',
    'M4 20l4-1L19 8a2 2 0 0 0-3-3L5 16l-1 4ZM14 7l3 3',
    'M3 20h18M5 20V9l5 3V9l5 3V9l4 2v9',
    'M3 7h11v8H3V7ZM14 10h4l3 3v2h-7v-5ZM7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    'M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z',
  ];
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d={paths[i]} stroke="#E4141C" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Advantages() {
  return (
    <section className="border-y border-line bg-line">
      <Container className="px-0 sm:px-0 lg:px-0">
        {/* gap-px + фон-линия = идеальные волосяные разделители при любом числе колонок */}
        <ul className="grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((it, i) => (
            <li key={it.t} className="group relative bg-paper2/60 transition-colors duration-500 hover:bg-white">
              <Reveal delay={i * 0.05} className="h-full">
                <div className="relative flex h-full flex-col px-5 py-8 sm:px-6 sm:py-10">
                  <span className="pointer-events-none absolute right-5 top-8 font-display text-[12px] font-bold tracking-[0.12em] text-line2 transition-colors duration-500 group-hover:text-red/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-line2 transition-colors duration-500 group-hover:border-red/40">
                    <Ic i={i} />
                  </span>
                  <h3 className="mt-5 font-display text-[15px] font-bold uppercase leading-tight tracking-tight text-ink">
                    {it.t}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-muted sm:text-[13.5px]">{it.d}</p>
                  <div className="mt-auto pt-6" aria-hidden="true">
                    <span className="block h-[2px] w-8 origin-left bg-red/25 transition-all duration-500 group-hover:w-12 group-hover:bg-red" />
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
