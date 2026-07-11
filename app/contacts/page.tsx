import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { LeadForm } from '@/components/forms/LeadForm';

export const metadata: Metadata = {
  title: 'Контакты | SANGER',
  description: 'Свяжитесь с SANGER: телефон, почта, заявка на расчёт командной спортивной формы.',
  alternates: { canonical: '/contacts' },
};

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="pt-[120px]">
        <Container>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-5xl">
            Контакты
          </h1>
          <div className="mt-8 flex flex-col gap-2">
            <a href="tel:88005551705" className="font-display text-2xl font-extrabold text-ink hover:text-red">
              8 800 555-17-05
            </a>
            <a href="mailto:team@sanger.ru" className="text-lg text-ink2 hover:text-red">
              team@sanger.ru
            </a>
          </div>
        </Container>
        <LeadForm landing="/contacts" />
      </main>
      <Footer />
    </>
  );
}
