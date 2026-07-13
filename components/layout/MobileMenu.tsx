'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Logo } from './Logo';
import { track } from '@/lib/analytics';

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileMenu({
  open,
  onClose,
  nav,
  studioHref,
}: {
  open: boolean;
  onClose: () => void;
  nav: { href: string; label: string }[];
  studioHref: string;
}) {
  const reduce = useReducedMotion();

  // блокируем прокрутку фона и закрываем по Escape, пока меню открыто
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 pb-8 pt-[18px] lg:hidden"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
        >
          <div className="mb-6 flex items-center justify-between">
            <Logo />
            <button
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-line2"
              aria-label="Закрыть меню"
              onClick={onClose}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="#111" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center" aria-label="Мобильная навигация">
            {nav.map((n, i) => (
              <motion.div
                key={n.href}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 + i * 0.05, ease: EASE }}
              >
                <Link
                  href={n.href}
                  onClick={onClose}
                  className="group flex items-center justify-between border-b border-line py-4 font-display text-[26px] font-bold uppercase leading-none tracking-tight text-ink"
                >
                  {n.label}
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    className="text-line2 transition-all duration-300 group-hover:translate-x-1 group-hover:text-red"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 + nav.length * 0.05, ease: EASE }}
          >
            <Link
              href={studioHref}
              onClick={() => {
                track('create_form_click', { place: 'mobile_menu' });
                onClose();
              }}
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-red text-[15px] font-semibold text-white transition-colors hover:bg-red-600"
            >
              Рассчитать стоимость
            </Link>
            <p className="mt-4 text-center font-sans text-[12px] uppercase tracking-[0.14em] text-muted">
              Собственное производство · от 5 комплектов
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
