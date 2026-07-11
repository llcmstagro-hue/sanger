import type { MetadataRoute } from 'next';
import { SPORT_ORDER } from '@/lib/sports';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanger.ru';
  const now = new Date();
  const staticRoutes = ['', '/about', '/contacts'].map((p) => ({
    url: `${base}${p || '/'}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.6,
  }));
  const sportRoutes = SPORT_ORDER.map((s) => ({
    url: `${base}/${s}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  return [...staticRoutes, ...sportRoutes];
}
