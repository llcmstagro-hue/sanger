import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';

const ITEMS = [
  { t: 'Индивидуальный дизайн', d: 'Уникальный стиль вашей команды' },
  { t: 'Собственное производство', d: 'Полный контроль качества' },
  { t: 'Заказ от 5 комплектов', d: 'Выгодные условия для команд' },
  { t: 'Доставка по России', d: 'Быстро и надёжно в любой регион' },
  { t: 'Помощь дизайнера', d: 'Бесплатно доработаем ваш макет' },
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
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
      <path d={paths[i]} stroke="#E4141C" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Advantages() {
  return (
    <section className="border-y border-line bg-paper2/50 py-4">
      <Container>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((it, i) => (
            <li
              key={it.t}
              className="border-l border-line px-4 py-7 first:border-l-0 md:[&:nth-child(4)]:border-l-0 lg:[&:nth-child(4)]:border-l"
            >
              <Reveal delay={i * 0.05}>
                <Ic i={i} />
                <h3 className="mt-4 font-display text-[15px] font-bold uppercase text-ink">{it.t}</h3>
                <p className="mt-1.5 text-[13.5px] leading-snug text-muted">{it.d}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
