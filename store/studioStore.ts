'use client';
import { create } from 'zustand';
import type { SportSlug, StudioState } from '@/types';
import { SPORTS } from '@/lib/sports';

interface StudioStore extends StudioState {
  setSport: (sport: SportSlug) => void;
  setTemplate: (template: string) => void;
  setBase: (c: string) => void;
  setAccent: (c: string) => void;
  setLogo: (dataUrl: string | null) => void;
  setSurname: (s: string) => void;
  setNumber: (n: string) => void;
  setSide: (s: 'front' | 'back') => void;
  applyPreset: (preset: Partial<StudioState>) => void;
  reset: (sport: SportSlug) => void;
}

function initialFor(sport: SportSlug): StudioState {
  const cfg = SPORTS[sport];
  return {
    sport,
    template: '2', // индекс паттерна (0..4); 2 = шеврон по умолчанию
    baseColor: cfg.baseDefault,
    accentColor: cfg.accentDefault,
    logo: null,
    surname: cfg.heroSurname,
    number: cfg.heroNumber,
    side: 'front',
  };
}

export const useStudio = create<StudioStore>((set) => ({
  ...initialFor('hockey'),
  setSport: (sport) =>
    set(() => ({
      sport,
      baseColor: SPORTS[sport].baseDefault,
      accentColor: SPORTS[sport].accentDefault,
    })),
  setTemplate: (template) => set({ template }),
  setBase: (baseColor) => set({ baseColor }),
  setAccent: (accentColor) => set({ accentColor }),
  setLogo: (logo) => set({ logo }),
  setSurname: (surname) => set({ surname: surname.toUpperCase().slice(0, 12) }),
  setNumber: (number) => set({ number: number.replace(/\D/g, '').slice(0, 2) }),
  setSide: (side) => set({ side }),
  applyPreset: (preset) => set((s) => ({ ...s, ...preset })),
  reset: (sport) => set(initialFor(sport)),
}));
