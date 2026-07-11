import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';

const STEPS = [
  { t: 'Вы создаёте идею', d: 'Собираете пример формы в Студии дизайна или присылаете эскиз.' },
  { t: 'Дизайнер дорабатывает', d: 'Готовим профессиональную визуализацию и согласуем детали.' },
  { t: 'Производство', d: 'Изготавливаем комплекты на собственном производстве.' },
  { t: 'Команда получает заказ', d: 'Доставляем готовую форму к первой игре.' },
];

export function OrderSteps() {
  return (
    <section className="py-16 sm:py-24" id="order">
      <Container>
        <SectionHeading eyebrow="Процесс" title={<>Как проходит заказ</>} />
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06}>
              <li className="relative flex min-h-[188px] flex-col rounded-2xl border border-line bg-white p-6">
                <span className="font-sans text-[12px] font-bold tracking-[0.18em] text-red">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-[18px] font-bold uppercase leading-tight text-ink">
                  {s.t}
                </h3>
                <p className="mt-2 text-[13.5px] text-muted">{s.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
