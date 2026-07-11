import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WorkCard } from './WorkCard';
import type { SportConfig } from '@/types';

export function Works({ sport }: { sport: SportConfig }) {
  return (
    <section className="py-16 sm:py-24" id="works">
      <Container>
        <SectionHeading eyebrow="Портфолио" title={<>Наши работы</>}>
          Команды, которые уже играют в форме SANGER.
        </SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sport.works.map((w) => (
            <WorkCard key={w.team} work={w} sport={sport.slug} sportName={sport.name} />
          ))}
        </div>
      </Container>
    </section>
  );
}
