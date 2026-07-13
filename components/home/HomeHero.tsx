'use client';
import { AtmosphereHero } from '@/components/hero/AtmosphereHero';
import { HOME_ATMOSPHERE } from '@/lib/atmosphere';
import { track } from '@/lib/analytics';

export function HomeHero() {
  return (
    <AtmosphereHero
      atmosphere={HOME_ATMOSPHERE}
      kicker="SANGER · цифровая фабрика экипировки"
      lines={['Создай', 'форму', 'своей', 'команды']}
      accentLines={[3]}
      sub="Мы не продаём одежду — мы создаём визуальную идентичность команды. Разрабатываем дизайн, шьём и наносим символику вашего клуба. От 5 комплектов."
      primary={{
        label: 'Рассчитать стоимость',
        href: '#lead',
        onClick: () => track('create_form_click', { place: 'home_hero' }),
      }}
      secondary={{ label: 'Смотреть видео', href: '#video' }}
      note="Собственное производство в России · от 5 комплектов"
      imageSrc="/assets/hero/home.webp"
      imageAlt="Хоккеист в форме с логотипом клуба на льду"
    />
  );
}
