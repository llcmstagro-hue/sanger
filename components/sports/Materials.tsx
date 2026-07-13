'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const MATERIALS = [
  {
    n: '01',
    title: 'Дышащий трикотаж',
    text: 'Профессиональные ткани с отводом влаги — форма остаётся сухой и лёгкой всю игру.',
  },
  {
    n: '02',
    title: 'Сублимация в полотно',
    text: 'Цвет и символика впечатываются в волокно, а не сверху: не трескаются и не выцветают.',
  },
  {
    n: '03',
    title: 'Усиленные швы',
    text: 'Двойная строчка на нагруженных зонах — экипировка держит темп сезона.',
  },
  {
    n: '04',
    title: 'Логотип клуба',
    text: 'Наносим символику вашей команды — вышивка или печать — точно по фирменным цветам.',
  },
];

export function Materials() {
  const reduce = useReducedMotion();
  return (
    <section id="materials" className="border-t border-line bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Материалы" title={<>Ткани, которые держат сезон</>}>
          Мы подбираем материал под вид спорта и нагрузку. Ниже — то, из чего собирается качество
          формы вашей команды.
        </SectionHeading>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {MATERIALS.map((m, i) => (
            <motion.div
              key={m.n}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white p-8 sm:p-10"
            >
              <div className="flex items-start gap-5">
                <span className="font-display text-[15px] font-black text-red">{m.n}</span>
                <div>
                  <h3 className="font-display text-[20px] font-bold uppercase tracking-tight text-ink sm:text-[23px]">
                    {m.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed text-muted">{m.text}</p>
                </div>
              </div>
              {/* красная строчка при наведении */}
              <span
                className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                style={{ backgroundImage: 'repeating-linear-gradient(90deg,#E4141C 0 10px,transparent 10px 18px)' }}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
