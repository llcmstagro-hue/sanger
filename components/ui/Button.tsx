import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost';
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-[15px] leading-none transition-all duration-300 ease-sanger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red min-h-[48px] px-7';
const styles: Record<Variant, string> = {
  primary:
    'bg-red text-white shadow-[0_10px_26px_-12px_rgba(228,20,28,0.7)] hover:bg-red-600 hover:-translate-y-0.5',
  ghost:
    'border border-line2 text-ink hover:border-ink hover:bg-black/[0.03] hover:-translate-y-0.5',
};

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  className,
  ariaLabel,
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  ariaLabel?: string;
}) {
  const cls = cn(base, styles[variant], className);
  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel');
    if (external) {
      return (
        <a href={href} className={cls} aria-label={ariaLabel} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
