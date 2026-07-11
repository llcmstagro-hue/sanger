import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <div className="mb-8 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow && (
            <span className="mb-3 flex items-center gap-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-red">
              <span className="h-[2px] w-7 bg-red" aria-hidden="true" />
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-3xl font-extrabold uppercase leading-[1.02] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        </div>
        {children && <div className="max-w-[36ch] text-[15px] text-muted">{children}</div>}
      </div>
    </Reveal>
  );
}
