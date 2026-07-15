import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';

const ITEMS = [
  { label: 'Спортивная сумка', name: 'Сумка команды', img: '/assets/accessories/bag.webp' },
  { label: 'Кепка', name: 'Кепка команды', img: '/assets/accessories/cap.webp' },
];

export function Accessories() {
  return (
    <section className="py-16 sm:py-24" id="accessories">
      <Container>
        <SectionHeading eyebrow="Аксессуары" title={<>Дополним комплект</>} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ITEMS.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.06}>
              <div className="group overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 ease-sanger hover:-translate-y-1 hover:border-line2 hover:shadow-soft">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper2">
                  <Image
                    src={it.img}
                    alt={it.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-sanger group-hover:scale-[1.03]"
                  />
                </div>
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
