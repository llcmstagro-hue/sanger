'use client';
import { useRef } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button, ArrowRight } from '@/components/ui/Button';
import { Placeholder } from '@/components/ui/Placeholder';
import type { SportConfig } from '@/types';
import { track } from '@/lib/analytics';

const line = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 0.85, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({ sport, studioHref }: { sport: SportConfig; studioHref: string }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const words = sport.h1.split(' ');
  // выделяем «своей команды» / ключевые слова красным для базового варианта
  return (
    <section
      className="relative overflow-hidden pt-[104px] pb-14 sm:pt-[120px] lg:pb-20"
      onMouseMove={onMove}
      ref={wrap}
    >
      <div
        className="pointer-events-none absolute right-[-6%] top-[6%] hidden h-[520px] w-[520px] rounded-full lg:block"
        style={{ background: 'radial-gradient(circle, rgba(228,20,28,0.10), transparent 66%)' }}
        aria-hidden="true"
      />
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div>
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line2 px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ink2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red" />
              {sport.eyebrow}
            </motion.span>

            <h1 className="font-display text-[34px] font-extrabold uppercase leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-[62px]">
              {words.map((w, i) => (
                <span key={i} className="mr-[0.28ch] inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block"
                    custom={i}
                    variants={reduce ? undefined : line}
                    initial={reduce ? false : 'hidden'}
                    animate={reduce ? undefined : 'show'}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-6 max-w-[46ch] text-[16px] text-muted sm:text-lg"
            >
              {sport.subtitle}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Button href={studioHref} onClick={() => track('create_form_click', { place: 'hero' })}>
                Создать форму <ArrowRight />
              </Button>
              <Button href="#works" variant="ghost">
                Наши работы
              </Button>
            </motion.div>

            <p className="mt-7 font-sans text-[13px] uppercase tracking-[0.08em] text-muted">
              Минимальный заказ — <b className="font-bold text-ink">от 5 комплектов</b>
            </p>
          </div>

          <motion.div
            style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
            initial={reduce ? false : { opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative"
          >
            <Placeholder
              label={`Hero · ${sport.name}`}
              sub="крупный спортсмен в движении"
              ratio="aspect-[4/5]"
              className="w-full shadow-card"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
