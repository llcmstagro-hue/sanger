'use client';
import { motion } from 'framer-motion';
import { Placeholder } from '@/components/ui/Placeholder';
import { useStudio } from '@/store/studioStore';
import { track } from '@/lib/analytics';
import type { SportSlug, WorkItem } from '@/types';

export function WorkCard({
  work,
  sport,
  sportName,
}: {
  work: WorkItem;
  sport: SportSlug;
  sportName: string;
}) {
  const applyPreset = useStudio((s) => s.applyPreset);
  const setSport = useStudio((s) => s.setSport);

  const useAsTemplate = () => {
    setSport(sport);
    applyPreset({
      baseColor: work.base,
      accentColor: work.accent,
      number: work.number,
      surname: work.team.toUpperCase(),
      side: 'front',
    });
    track('template_selected', { from: 'works', team: work.team, sport });
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl border border-line bg-white"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-sanger group-hover:scale-[1.03]">
          <Placeholder
            label={`${sportName} · ${work.team}`}
            sub="фото команды"
            rounded="rounded-none"
            className="h-full w-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 gap-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            className="min-h-[40px] flex-1 rounded-full bg-white/95 px-3 text-[12.5px] font-semibold text-ink"
            onClick={useAsTemplate}
          >
            Использовать как шаблон
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-muted">{sportName}</span>
        <span className="font-display text-[15px] font-bold text-ink">{work.team}</span>
      </div>
    </motion.article>
  );
}
