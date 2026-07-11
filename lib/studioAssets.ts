import type { SportSlug } from '@/types';

// ============================================================================
// КОНТРАКТ МОКАПОВ СТУДИИ
// Реалистичные рендеры спортсмена (front/back) на белом фоне.
// Файлы кладутся в public/assets/studio/<sport>/:
//   front.png        — фигура спереди (рек. 1200×1600, фон #FFFFFF/прозрачный)
//   back.png         — фигура сзади (та же геометрия кадра)
//   front-mask.png   — опционально: маска зоны джерси (белое = перекрашивается)
//   back-mask.png    — опционально: маска зоны джерси сзади
// После добавления файлов поставьте available: true — Студия сама переключится
// с векторного фолбэка на фото. Ничего больше менять не нужно.
// ============================================================================

export interface OverlayBox {
  /** проценты от ширины/высоты кадра */
  x: number; // центр по X, %
  y: number; // базовая линия по Y, %
  w: number; // ширина текстового бокса, %
  size: number; // размер шрифта, % от высоты кадра
}

export interface MockupConfig {
  available: boolean;
  front: string;
  back: string;
  frontMask?: string;
  backMask?: string;
  /** позиция фамилии на спине */
  nameBox: OverlayBox;
  /** позиция номера на спине */
  numberBox: OverlayBox;
}

const dir = (s: string) => `/assets/studio/${s}`;

function preset(sport: SportSlug, over?: Partial<MockupConfig>): MockupConfig {
  return {
    available: false, // ← переключите на true, когда положите файлы
    front: `${dir(sport)}/front.png`,
    back: `${dir(sport)}/back.png`,
    frontMask: `${dir(sport)}/front-mask.png`,
    backMask: `${dir(sport)}/back-mask.png`,
    nameBox: { x: 50, y: 24, w: 40, size: 3.2 },
    numberBox: { x: 50, y: 40, w: 40, size: 11 },
    ...over,
  };
}

export const MOCKUPS: Record<SportSlug, MockupConfig> = {
  hockey: preset('hockey', {
    nameBox: { x: 50, y: 22.5, w: 38, size: 3.0 },
    numberBox: { x: 50, y: 37, w: 38, size: 10.5 },
  }),
  football: preset('football'),
  volleyball: preset('volleyball'),
  basketball: preset('basketball'),
  mma: preset('mma', {
    nameBox: { x: 50, y: 21, w: 40, size: 2.8 },
    numberBox: { x: 50, y: 34, w: 40, size: 8.5 },
  }),
};
