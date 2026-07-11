import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';

const REASONS = [
  { t: 'Индивидуальный дизайн', d: 'Разрабатываем форму под вашу команду с нуля.' },
  { t: 'Собственное производство', d: 'Контролируем каждый этап от раскроя до упаковки.' },
  { t: 'Заказ от 5 комплектов', d: 'Удобно для команд любого размера.' },
  { t: 'Доставка по России', d: 'Отправляем в любой регион.' },
  { t: 'Помощь дизайнера', d: 'Бесплатно доработаем эскиз и подготовим визуализацию.' },
  { t: 'Контроль качества', d: 'Проверяем посадку, цвет и нанесение.' },
];

export function WhySanger() {
  return (
    <section className="bg-paper2/50 py-16 sm:py-24" id="why">
      <Container>
        <SectionHeading eyebrow="Почему SANGER" title={<>Причины выбрать нас</>} />
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal key={r.t} delay={i * 0.05}>
              <div className="border-t-2 border-line pt-5">
                <h3 className="font-display text-[17px] font-bold text-ink">{r.t}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
