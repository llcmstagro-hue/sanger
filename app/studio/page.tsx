import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Studio } from '@/components/studio/Studio';
import { LeadForm } from '@/components/forms/LeadForm';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Студия дизайна формы онлайн | SANGER',
  description:
    'Соберите пример формы вашей команды онлайн: цвет, шаблон, фамилия и номер — и получите бесплатный расчёт. SANGER — производство командной экипировки на заказ.',
  alternates: { canonical: '/studio' },
  openGraph: { title: 'Студия дизайна формы | SANGER', url: '/studio' },
};

export default function StudioPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-line bg-ice pt-[128px] pb-14">
          <Container>
            <p className="mb-5 font-sans text-[11px] uppercase tracking-[0.18em] text-muted">
              Студия дизайна · онлайн
            </p>
            <h1 className="max-w-[16ch] font-display text-[clamp(36px,6vw,68px)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-ink">
              Соберите форму <span className="text-red">команды</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[17px] text-muted sm:text-lg">
              Быстрый пример вашей формы: цвет, шаблон, фамилия и номер. Наш дизайнер бесплатно
              доработает макет и подготовит профессиональную визуализацию.
            </p>
          </Container>
        </section>
        <Studio />
        <LeadForm landing="studio" />
      </main>
      <Footer />
    </>
  );
}
