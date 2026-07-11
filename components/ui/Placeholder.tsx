import { cn } from '@/lib/cn';

// Аккуратный плейсхолдер фотографии: сохраняет размеры/композицию утверждённого макета.
// Заменяется на реальные WebP/AVIF в public/assets без изменения вёрстки.
export function Placeholder({
  label,
  sub,
  className,
  ratio,
  rounded = 'rounded-2xl',
}: {
  label: string;
  sub?: string;
  className?: string;
  ratio?: string; // например 'aspect-[4/5]'
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-paper2',
        rounded,
        ratio,
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-3 rounded-xl border border-dashed border-black/15" />
      <div className="absolute left-5 bottom-5">
        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-red">
          {label}
        </div>
        {sub && (
          <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.14em] text-muted">
            {sub}
          </div>
        )}
      </div>
      <svg
        className="absolute right-4 top-4 h-3.5 w-3.5 opacity-40"
        viewBox="0 0 14 14"
      >
        <path d="M7 0v14M0 7h14" stroke="#E4141C" strokeWidth="1" />
      </svg>
    </div>
  );
}
