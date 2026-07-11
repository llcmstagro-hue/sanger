'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Placeholder } from '@/components/ui/Placeholder';
import { ALL_SPORTS } from '@/lib/sports';

const SUB: Record<string, string> = {
  hockey: 'Джерси, гамаши, тренировочная форма',
  football: 'Футболки, шорты, гетры, ветровки',
  volleyball: 'Мужская и женская форма',
  basketball: 'Майки, шорты, двусторонние комплекты',
  mma: 'Рашгарды, шорты, борцовское трико',
};

export function SportsGrid() {
  return (
    <section className="py-16 sm:py-24" id="sports">
      <Container>
        <SectionHeading eyebrow="Направления" title={<>Виды спорта</>} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {ALL_SPORTS.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/${s.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 ease-sanger hover:-translate-y-1.5 hover:border-red hover:shadow-soft"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 ease-sanger group-hover:scale-[1.04]">
                    <Placeholder label={s.name} sub="фото дисциплины" rounded="rounded-none" className="h-full w-full" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-display text-[17px] font-extrabold uppercase text-ink">{s.name}</div>
                  <div className="mt-1 text-[12.5px] leading-snug text-muted">{SUB[s.slug]}</div>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-red">
                    Перейти
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
