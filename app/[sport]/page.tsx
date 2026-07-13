import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SPORT_ORDER, getSport } from '@/lib/sports';
import type { SportSlug } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SportHero } from '@/components/sports/SportHero';
import { ClientMarquee } from '@/components/marketing/ClientMarquee';
import { Advantages } from '@/components/sports/Advantages';
import { Assortment } from '@/components/sports/Assortment';
import { Production } from '@/components/sports/Production';
import { Materials } from '@/components/sports/Materials';
import { OrderSteps } from '@/components/sports/OrderSteps';
import { Accessories } from '@/components/sports/Accessories';
import { SportsGrid } from '@/components/home/SportsGrid';
import { Faq } from '@/components/sports/Faq';
import { LeadForm } from '@/components/forms/LeadForm';
import { PageView } from '@/components/sports/PageView';

export function generateStaticParams() {
  return SPORT_ORDER.map((sport) => ({ sport }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { sport: string } }): Metadata {
  const sport = getSport(params.sport);
  if (!sport) return {};
  const url = `/${sport.slug}`;
  return {
    title: sport.seoTitle,
    description: sport.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: sport.seoTitle,
      description: sport.seoDescription,
      url,
      type: 'website',
    },
  };
}

export default function SportPage({ params }: { params: { sport: string } }) {
  const sport = getSport(params.sport);
  if (!sport) notFound();

  const slug = sport.slug as SportSlug;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: sport.seoTitle,
    description: sport.seoDescription,
    brand: { '@type': 'Brand', name: 'SANGER' },
    category: 'Спортивная форма на заказ',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      offerCount: sport.assortment.length,
    },
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sport.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <PageView sport={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main>
        <SportHero slug={slug} />
        <ClientMarquee />
        <Advantages />
        <Assortment sport={sport} />
        <Production />
        <Materials />
        <OrderSteps />
        {sport.accessories && <Accessories />}
        <SportsGrid />
        <Faq items={sport.faq} />
        <LeadForm landing={`/${slug}`} defaultSport={slug} />
      </main>
      <Footer />
    </>
  );
}
