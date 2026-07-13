import type { SportSlug } from '@/types';

// ============================================================================
// АТМОСФЕРА
// Каждая посадочная — отдельная рекламная кампания: свой свет, температура,
// «строчка», тип микрочастиц. Но токены единые, поэтому язык дизайна общий.
// Никаких цветных градиентов: только нейтральный «живой свет» + красный акцент.
// ============================================================================

export type Particle = 'ice' | 'grass' | 'dust' | 'spark' | 'smoke';

export interface Atmosphere {
  /** очень холодный/тёплый оттенок фона первого экрана (почти белый) */
  tint: string;
  /** мягкий «живой свет» за фигурой — нейтральный, низкой насыщенности */
  light: string;
  /** цвет «строчки»/акцента: почти всегда бренд-красный */
  stitch: string;
  /** тип микрочастиц над сценой */
  particle: Particle;
  /** температура кадра словами — для подписи-атмосферы */
  temperature: string;
  /** имя клиентского клуба на груди (НЕ SANGER) */
  clientClub: string;
  /** короткая надпись-атмосфера под фигурой */
  scene: string;
}

const RED = '#E4141C';

export const ATMOSPHERE: Record<SportSlug, Atmosphere> = {
  hockey: {
    tint: '#F5F8FB',
    light: 'rgba(120,160,210,0.10)',
    stitch: RED,
    particle: 'ice',
    temperature: 'холодный свет · лёд',
    clientClub: 'МЕТЕОР',
    scene: 'Белый лёд · снежная пыль · динамика',
  },
  football: {
    tint: '#F4F7F3',
    light: 'rgba(60,150,90,0.10)',
    stitch: RED,
    particle: 'grass',
    temperature: 'вечерний свет · стадион',
    clientClub: 'ТИТАН',
    scene: 'Большой стадион · газон · игрок в движении',
  },
  volleyball: {
    tint: '#F6F7FA',
    light: 'rgba(120,140,200,0.09)',
    stitch: RED,
    particle: 'dust',
    temperature: 'чистый свет · арена',
    clientClub: 'ВЫСОТА',
    scene: 'Современная арена · прыжок · воздух',
  },
  basketball: {
    tint: '#FAF6F2',
    light: 'rgba(200,120,60,0.10)',
    stitch: RED,
    particle: 'dust',
    temperature: 'тёплый контровой · паркет',
    clientClub: 'ФЕНИКС',
    scene: 'Большая арена · паркет · энергия',
  },
  mma: {
    tint: '#F3F4F5',
    light: 'rgba(90,95,105,0.12)',
    stitch: RED,
    particle: 'smoke',
    temperature: 'тёмный контровой · дым',
    clientClub: 'ЛЕГИОН',
    scene: 'Тёмный зал · дым · контровой свет',
  },
};

// Главная наследует ледяную атмосферу утверждённого hero (хоккеист).
export const HOME_ATMOSPHERE: Atmosphere = {
  tint: '#F5F8FB',
  light: 'rgba(120,160,210,0.10)',
  stitch: RED,
  particle: 'ice',
  temperature: 'белый ледяной свет',
  clientClub: 'ВАШ КЛУБ',
  scene: 'Форма с логотипом вашей команды',
};

export function getAtmosphere(slug: SportSlug): Atmosphere {
  return ATMOSPHERE[slug];
}
