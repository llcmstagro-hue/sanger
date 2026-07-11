import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'О компании | SANGER',
  description:
    'SANGER — производство командной спортивной формы на заказ. Индивидуальный дизайн, собственное производство, помощь дизайнера, доставка по России.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-[120px]">
        <Container>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-5xl">
            О компании <span className="text-red">SANGER</span>
          </h1>
          <div className="mt-8 grid max-w-3xl gap-5 text-[17px] leading-relaxed text-muted">
            <p>
              SANGER — производитель командной спортивной формы на заказ. Мы создаём индивидуальную
              экипировку для хоккея, футбола, волейбола, баскетбола и MMA.
            </p>
            <p>
              Работаем на собственном производстве и контролируем каждый этап: от дизайна и раскроя
              до нанесения и упаковки. Наш дизайнер бесплатно дорабатывает ваш эскиз и готовит
              профессиональную визуализацию.
            </p>
            <p>Минимальный заказ — от 5 комплектов. Доставка по всей России.</p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
