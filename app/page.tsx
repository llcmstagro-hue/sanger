import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeHero } from '@/components/home/HomeHero';
import { SportsGrid } from '@/components/home/SportsGrid';
import { ClientMarquee } from '@/components/marketing/ClientMarquee';
import { Advantages } from '@/components/sports/Advantages';
import { Production } from '@/components/sports/Production';
import { Materials } from '@/components/sports/Materials';
import { OrderSteps } from '@/components/sports/OrderSteps';
import { LeadForm } from '@/components/forms/LeadForm';

export const metadata: Metadata = {
  title: 'SANGER — командная спортивная форма на заказ',
  description:
    'Производство командной спортивной формы на заказ: хоккей, футбол, волейбол, баскетбол, MMA. Индивидуальный дизайн, собственное производство, от 5 комплектов.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'SANGER — командная спортивная форма на заказ',
    description: 'Индивидуальный дизайн формы для вашей команды. От 5 комплектов, доставка по России.',
    url: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HomeHero />
        <ClientMarquee />
        <SportsGrid />
        <Advantages />
        <Production />
        <Materials />
        <OrderSteps />
        <LeadForm landing="home" />
      </main>
      <Footer />
    </>
  );
}
