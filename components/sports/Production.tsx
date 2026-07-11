import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Placeholder } from '@/components/ui/Placeholder';

const CELLS = [
  { label: 'Ткань крупным планом', k: 'Материалы', v: 'Дышащие ткани, которые держат цвет и форму.' },
  { label: 'Швейная машина · руки мастера', k: 'Пошив', v: 'Аккуратные швы и посадка по фигуре.' },
  { label: 'Нанесение номера', k: 'Нанесение', v: 'Фамилии, номера и логотипы — чётко и надолго.' },
  { label: 'Готовые комплекты · упаковка', k: 'Контроль', v: 'Проверяем каждый комплект перед отправкой.' },
];

export function Production() {
  return (
    <section className="py-16 sm:py-24" id="production">
      <Container>
        <SectionHeading eyebrow="Производство" title={<>Собственное производство</>}>
          Качество, которое видно в деталях: ткань, швы, нанесение.
        </SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CELLS.map((c, i) => (
            <Reveal key={c.k} delay={i * 0.05}>
              <figure>
                <Placeholder label={c.label} ratio="aspect-[3/3.4]" className="w-full" />
                <figcaption className="mt-4">
                  <div className="font-display text-[15px] font-bold uppercase text-ink">{c.k}</div>
                  <p className="mt-1 text-[13.5px] leading-snug text-muted">{c.v}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
