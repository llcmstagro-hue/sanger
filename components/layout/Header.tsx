'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { ArrowRight } from '@/components/ui/Button';
import { track } from '@/lib/analytics';

const NAV = [
  { href: '/#sports', label: 'Виды спорта' },
  { href: '/#production', label: 'Производство' },
  { href: '/#materials', label: 'Материалы' },
  { href: '/studio', label: 'Студия дизайна' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
];

export function Header({ studioHref = '/#lead' }: { studioHref?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ease-sanger ${
        scrolled
          ? 'border-line bg-paper/85 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <Container>
        <div
          className={`flex items-center gap-8 transition-all duration-300 ${
            scrolled ? 'h-[60px]' : 'h-[74px]'
          }`}
        >
          <Logo />
          <nav className="ml-2 hidden items-center gap-7 lg:flex" aria-label="Основная навигация">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="group relative py-1.5 text-[13.5px] font-medium text-ink2 transition-colors hover:text-ink"
              >
                {n.label}
                <span className="absolute inset-x-0 bottom-0 h-[1.5px] w-0 bg-red transition-all duration-300 ease-sanger group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <div className="ml-auto hidden lg:block">
            <Link
              href={studioHref}
              onClick={() => track('create_form_click', { place: 'header' })}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-red px-5 text-[13.5px] font-semibold text-white transition-all duration-300 ease-sanger hover:-translate-y-0.5 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Рассчитать стоимость <ArrowRight />
            </Link>
          </div>
          <button
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg border border-line2 lg:hidden"
            aria-label="Открыть меню"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </Container>
      <MobileMenu open={open} onClose={() => setOpen(false)} nav={NAV} studioHref={studioHref} />
    </header>
  );
}
