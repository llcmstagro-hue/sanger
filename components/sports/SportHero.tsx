'use client';
import { AtmosphereHero } from '@/components/hero/AtmosphereHero';
import { HockeyHero } from '@/components/hero/HockeyHero';
import { getAtmosphere } from '@/lib/atmosphere';
import { track } from '@/lib/analytics';
import type { SportSlug } from '@/types';

export function SportHero({ slug }: { slug: SportSlug }) {
  const a = getAtmosphere(slug);
  // TASK 001 — эталонный hero хоккейной страницы (отдельная сцена).
  if (slug === 'hockey') return <HockeyHero studioHref="#lead" />;
  return (
    <AtmosphereHero
      atmosphere={a}
      kicker={a.heroKicker}
      lines={a.heroLines}
      accentLines={a.heroAccent}
      sub={a.heroSub}
      primary={{
        label: 'Рассчитать стоимость',
        href: '#lead',
        onClick: () => track('create_form_click', { place: 'sport_hero', sport: slug }),
      }}
      secondary={{ label: 'Как проходит заказ', href: '#order' }}
      note="Собственное производство в России · от 5 комплектов"
      imageSrc={`/assets/hero/${slug}.webp`}
      imageAlt={`${a.heroKicker}: спортсмен в форме с символикой клуба`}
    />
  );
}
