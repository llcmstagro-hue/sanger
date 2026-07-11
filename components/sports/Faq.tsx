'use client';
import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AnimatePresence, motion } from 'framer-motion';
import type { FaqItem } from '@/types';

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-paper2/50 py-16 sm:py-24" id="faq">
      <Container>
        <SectionHeading eyebrow="Вопросы" title={<>Частые вопросы</>} />
        <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <h3>
                  <button
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="font-display text-[17px] font-bold text-ink">{it.q}</span>
                    <span
                      className={`grid h-8 w-8 flex-none place-items-center rounded-full border border-line2 text-red transition-transform ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-12 text-[15px] leading-relaxed text-muted">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
