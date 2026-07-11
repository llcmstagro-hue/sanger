'use client';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo';
import { track } from '@/lib/analytics';

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
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-paper p-6 lg:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 flex items-center justify-between">
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
          <nav className="flex flex-col" aria-label="Мобильная навигация">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={onClose}
                className="border-b border-line py-4 font-display text-2xl font-bold uppercase text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            href={studioHref}
            onClick={() => {
              track('create_form_click', { place: 'mobile_menu' });
              onClose();
            }}
            className="mt-6 flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-red font-semibold text-white"
          >
            Создать форму
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
