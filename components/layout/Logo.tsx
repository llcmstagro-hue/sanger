import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 font-display text-[21px] font-extrabold tracking-[0.04em] text-ink ${className ?? ''}`}
      aria-label="SANGER — на главную"
    >
      <span className="inline-block h-[3px] w-6 rounded bg-red" aria-hidden="true" />
      SANGER
    </Link>
  );
}
