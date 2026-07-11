import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SPORT_ORDER, getSport } from '@/lib/sports';
import type { SportSlug } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sports/Hero';
import { Advantages } from '@/components/sports/Advantages';
import { Assortment } from '@/components/sports/Assortment';
import { Works } from '@/components/sports/Works';
import { Studio } from '@/components/studio/Studio';
import { Production } from '@/components/sports/Production';
import { WhySanger } from '@/components/sports/WhySanger';
import { OrderSteps } from '@/components/sports/OrderSteps';
import { Accessories } from '@/components/sports/Accessories';
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
      <Header studioHref="#studio" />
      <main>
        <Hero sport={sport} studioHref="#studio" />
        <Advantages />
        <Assortment sport={sport} />
        <Works sport={sport} />
        <Studio defaultSport={slug} />
        <Production />
        <WhySanger />
        <OrderSteps />
        {sport.accessories && <Accessories />}
        <Faq items={sport.faq} />
        <LeadForm landing={`/${slug}`} defaultSport={slug} />
      </main>
      <Footer />
    </>
  );
}
