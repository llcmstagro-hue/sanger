import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Placeholder } from '@/components/ui/Placeholder';

const ITEMS = [
  { label: 'Спортивная сумка', name: 'Сумка команды' },
  { label: 'Кепка', name: 'Кепка команды' },
];

export function Accessories() {
  return (
    <section className="py-16 sm:py-24" id="accessories">
      <Container>
        <SectionHeading eyebrow="Аксессуары" title={<>Дополним комплект</>} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ITEMS.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.06}>
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <Placeholder label={it.label} ratio="aspect-[16/9]" rounded="rounded-none" className="w-full" />
                <div className="px-5 py-4">
                  <span className="font-display text-[16px] font-bold text-ink">{it.name}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
