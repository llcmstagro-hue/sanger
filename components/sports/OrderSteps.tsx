'use client';
import { motion, useReducedMotion } from 'framer-motion';
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
  const reduce = useReducedMotion();
  return (
    <section className="py-16 sm:py-24" id="order">
      <Container>
        <SectionHeading eyebrow="Процесс" title={<>Как проходит заказ</>}>
          Четыре шага от идеи до готовой формы в руках команды.
        </SectionHeading>

        <div className="relative">
          {/* горизонтальный рельс — только на десктопе, по центру узлов */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-line lg:block"
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px origin-left bg-red lg:block"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          />

          <ol className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08} className="h-full">
                <li className="relative flex min-h-[172px] flex-col rounded-2xl border border-line bg-white p-6 lg:min-h-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pr-6">
                  {/* узел */}
                  <span className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-line2 bg-white font-display text-[13px] font-bold text-ink shadow-[0_6px_16px_-10px_rgba(17,17,17,0.5)] transition-colors lg:border-red lg:text-red">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-[18px] font-bold uppercase leading-tight tracking-tight text-ink">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-snug text-muted">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
