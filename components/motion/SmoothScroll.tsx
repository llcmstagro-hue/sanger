'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Премиальный инерционный скролл + каноническая связка с GSAP ScrollTrigger,
// чтобы пиннинг производства был идеально синхронизирован с Lenis.
// Отключается при prefers-reduced-motion (тогда работает нативный скролл,
// а ScrollTrigger обновляется по нативным событиям).
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.registerPlugin(ScrollTrigger);

    if (reduce) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    document.documentElement.classList.add('lenis');

    // держим ScrollTrigger в такте с Lenis
    lenis.on('scroll', ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // якорные ссылки внутри страницы скроллим через Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -84, duration: 1.2 });
      history.replaceState(null, '', id);
    };
    document.addEventListener('click', onClick);

    return () => {
      gsap.ticker.remove(onTick);
      document.removeEventListener('click', onClick);
      document.documentElement.classList.remove('lenis');
      lenis.destroy();
    };
  }, []);

  return null;
}
