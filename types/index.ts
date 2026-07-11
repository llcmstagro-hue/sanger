export type SportSlug = 'hockey' | 'football' | 'volleyball' | 'basketball' | 'mma';

export interface WorkItem {
  team: string;
  base: string;
  accent: string;
  number: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SportConfig {
  slug: SportSlug;
  name: string;              // «Хоккей»
  nameGen: string;           // «хоккейной формы» (родительный) — для текстов
  h1: string;
  subtitle: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  assortment: string[];
  works: WorkItem[];
  accessories: boolean;      // показывать блок аксессуаров
  faq: FaqItem[];
  heroSurname: string;
  heroNumber: string;
  studioTemplate: 'jersey' | 'kit' | 'singlet' | 'rashguard';
  accentDefault: string;
  baseDefault: string;
}

export interface StudioState {
  sport: SportSlug;
  template: string;
  baseColor: string;
  accentColor: string;
  logo: string | null;      // dataURL
  surname: string;
  number: string;
  side: 'front' | 'back';
}

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  sport: string;
  quantity: string;
  comment?: string;
  logo?: string | null;
  consent: boolean;
  // context
  landing?: string;
  studio?: Partial<StudioState>;
  utm?: Record<string, string>;
}
