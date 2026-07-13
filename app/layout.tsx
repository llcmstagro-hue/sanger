import type { Metadata } from 'next';
import { Montserrat, Manrope } from 'next/font/google';
import './globals.css';
import { AnalyticsProvider } from '@/components/motion/AnalyticsProvider';
import { SmoothScroll } from '@/components/motion/SmoothScroll';

const display = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});
const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanger.ru';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SANGER — командная спортивная форма на заказ',
    template: '%s',
  },
  description:
    'SANGER — производство командной спортивной формы на заказ. Хоккей, футбол, волейбол, баскетбол, MMA. Индивидуальный дизайн, собственное производство, от 5 комплектов.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'SANGER',
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <SmoothScroll />
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  );
}
