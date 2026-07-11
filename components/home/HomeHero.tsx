'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button, ArrowRight } from '@/components/ui/Button';
import { Placeholder } from '@/components/ui/Placeholder';
import { track } from '@/lib/analytics';

export function HomeHero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pt-[104px] pb-14 sm:pt-[120px] lg:pb-20">
      <div
        className="pointer-events-none absolute right-[-6%] top-[6%] hidden h-[520px] w-[520px] rounded-full lg:block"
        style={{ background: 'radial-gradient(circle, rgba(228,20,28,0.10), transparent 66%)' }}
        aria-hidden="true"
      />
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div>
            <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line2 px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ink2">
              <span className="h-1.5 w-1.5 rounded-full bg-red" />
              SANGER · экипировка на заказ
            </span>
            <h1 className="font-display text-[36px] font-extrabold uppercase leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-[64px]">
              Создай форму<br />
              <span className="text-red">своей команды</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-[16px] text-muted sm:text-lg">
              Профессиональная спортивная экипировка с индивидуальным дизайном. Собственное
              производство, от 5 комплектов.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="#studio" onClick={() => track('create_form_click', { place: 'home_hero' })}>
                Создать форму <ArrowRight />
              </Button>
              <Button href="#works" variant="ghost">Наши работы</Button>
            </div>
            <p className="mt-7 font-sans text-[13px] uppercase tracking-[0.08em] text-muted">
              Минимальный заказ — <b className="font-bold text-ink">от 5 комплектов</b>
            </p>
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <Placeholder label="Hero · спортсмен" sub="крупный спортсмен в движении" ratio="aspect-[4/5]" className="w-full shadow-card" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
