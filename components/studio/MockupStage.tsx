'use client';
import { motion } from 'framer-motion';
import { MOCKUPS } from '@/lib/studioAssets';
import { useStudio } from '@/store/studioStore';
import { Jersey } from './Jersey';

// ============================================================================
// Фигура спортсмена в Студии.
// Режим ФОТО (available: true): реалистичный рендер + перекраска джерси через
// маску (mix-blend-mode) + фамилия/номер поверх фотографии на спине.
// Режим ФОЛБЭК (assets ещё не добавлены): векторная схема, чтобы проект
// оставался рабочим до загрузки рендеров.
// ============================================================================

export function FigureView({ side }: { side: 'front' | 'back' }) {
  const s = useStudio();
  const cfg = MOCKUPS[s.sport];
  const pattern = Number.isFinite(Number(s.template)) ? Number(s.template) : 2;

  if (!cfg.available) {
    // Фолбэк до загрузки рендеров (см. public/assets/studio/README.md)
    return (
      <div className="relative grid w-full place-items-center">
        <Jersey
          className="w-[min(300px,85%)] drop-shadow-[0_24px_36px_rgba(17,17,17,0.14)]"
          base={s.baseColor}
          accent={s.accentColor}
          pattern={pattern}
          logo={s.logo}
          surname={s.surname}
          number={s.number}
          side={side}
          id={`fig-${side}`}
        />
        <span className="pointer-events-none absolute bottom-2 rounded-full bg-paper2 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-muted">
          Схема · фото-рендер подключается в assets/studio
        </span>
      </div>
    );
  }

  const img = side === 'front' ? cfg.front : cfg.back;
  const mask = side === 'front' ? cfg.frontMask : cfg.backMask;
  const key = `${s.sport}-${side}-${s.baseColor}-${s.accentColor}`;

  return (
    <motion.div
      key={key}
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-[420px]"
        style={{ containerType: 'size' }}
      >
        {/* базовый рендер */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={side === 'front' ? 'Форма спереди' : 'Форма сзади'}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />

        {/* перекраска джерси: цвет через маску, hue меняется, светотень фото сохраняется */}
        {mask && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundColor: s.baseColor,
              WebkitMaskImage: `url(${mask})`,
              maskImage: `url(${mask})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              mixBlendMode: 'color',
              transition: 'background-color 200ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        )}

        {/* логотип на груди поверх фото */}
        {side === 'front' && s.logo && (
          <motion.img
            src={s.logo}
            alt="Логотип команды"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 h-[9%] w-auto -translate-x-1/2 object-contain"
            style={{ top: '30%' }}
            draggable={false}
          />
        )}

        {/* фамилия и номер на спине поверх фото */}
        {side === 'back' && (
          <>
            <span
              className="absolute -translate-x-1/2 text-center font-display font-extrabold uppercase leading-none text-white"
              style={{
                left: `${cfg.nameBox.x}%`,
                top: `${cfg.nameBox.y}%`,
                width: `${cfg.nameBox.w}%`,
                fontSize: `${cfg.nameBox.size}cqh`,
                letterSpacing: '0.14em',
                textShadow: '0 1px 3px rgba(0,0,0,0.45)',
              }}
            >
              {s.surname}
            </span>
            <span
              className="absolute -translate-x-1/2 text-center font-display font-black leading-none text-white"
              style={{
                left: `${cfg.numberBox.x}%`,
                top: `${cfg.numberBox.y}%`,
                width: `${cfg.numberBox.w}%`,
                fontSize: `${cfg.numberBox.size}cqh`,
                textShadow: '0 2px 5px rgba(0,0,0,0.45)',
              }}
            >
              {s.number}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
