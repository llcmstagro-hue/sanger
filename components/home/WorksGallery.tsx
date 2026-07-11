'use client';
import { useMemo, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WorkCard } from '@/components/sports/WorkCard';
import { ALL_SPORTS } from '@/lib/sports';
import type { SportSlug, WorkItem } from '@/types';

interface Row {
  work: WorkItem;
  sport: SportSlug;
  sportName: string;
}

const FILTERS: { key: 'all' | SportSlug; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'hockey', label: 'Хоккей' },
  { key: 'football', label: 'Футбол' },
  { key: 'volleyball', label: 'Волейбол' },
  { key: 'basketball', label: 'Баскетбол' },
  { key: 'mma', label: 'Единоборства' },
];

export function WorksGallery() {
  const [filter, setFilter] = useState<'all' | SportSlug>('all');

  const rows: Row[] = useMemo(
    () =>
      ALL_SPORTS.flatMap((s) =>
        s.works.map((w) => ({ work: w, sport: s.slug, sportName: s.name })),
      ),
    [],
  );

  const visible = filter === 'all' ? rows : rows.filter((r) => r.sport === filter);

  return (
    <section className="py-16 sm:py-24" id="works">
      <Container>
        <SectionHeading eyebrow="Портфолио" title={<>Наши работы</>} />
        <div className="mb-8 flex flex-wrap gap-2.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`min-h-[42px] rounded-full border px-5 font-sans text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
                filter === f.key ? 'border-red bg-red text-white' : 'border-line2 text-ink2 hover:border-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((r) => (
            <WorkCard key={`${r.sport}-${r.work.team}`} work={r.work} sport={r.sport} sportName={r.sportName} />
          ))}
        </div>
      </Container>
    </section>
  );
}
