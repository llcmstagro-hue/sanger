import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import type { SportConfig } from '@/types';

export function Assortment({ sport }: { sport: SportConfig }) {
  return (
    <section className="py-16 sm:py-24" id="assortment">
      <Container>
        <SectionHeading eyebrow={`Ассортимент · ${sport.name}`} title={<>Что мы изготавливаем</>} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sport.assortment.map((a, i) => (
            <Reveal key={a} delay={i * 0.04}>
              <div className="group flex min-h-[112px] flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-all duration-300 ease-sanger hover:-translate-y-1 hover:border-line2 hover:shadow-soft">
                <span className="font-sans text-[11px] font-bold tracking-[0.16em] text-red">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[16px] font-bold leading-tight text-ink">{a}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
