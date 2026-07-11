'use client';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { ALL_SPORTS } from '@/lib/sports';
import { track } from '@/lib/analytics';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper2/60">
      <Container>
        <div className="grid grid-cols-1 gap-9 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="mb-4" />
            <p className="max-w-[30ch] text-sm text-muted">
              Производство командной спортивной формы на заказ. Индивидуальный дизайн, собственное
              производство, доставка по России.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              Виды спорта
            </h3>
            <ul className="flex flex-col gap-2.5">
              {ALL_SPORTS.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="text-[15px] text-ink2 hover:text-red">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              Компания
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/#studio" className="text-[15px] text-ink2 hover:text-red">Студия дизайна</Link></li>
              <li><Link href="/#works" className="text-[15px] text-ink2 hover:text-red">Наши работы</Link></li>
              <li><Link href="/#production" className="text-[15px] text-ink2 hover:text-red">Производство</Link></li>
              <li><Link href="/about" className="text-[15px] text-ink2 hover:text-red">О компании</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              Контакты
            </h3>
            <a
              href="tel:88005551705"
              onClick={() => track('phone_click', { place: 'footer' })}
              className="block font-display text-lg font-extrabold text-ink hover:text-red"
            >
              8 800 555-17-05
            </a>
            <a href="mailto:team@sanger.ru" className="mt-2 block text-[15px] text-ink2 hover:text-red">
              team@sanger.ru
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-line py-6 text-[13px] text-muted sm:flex-row sm:justify-between">
          <span>© 2026 SANGER · Командная спортивная форма на заказ</span>
          <span>Минимальный заказ — от 5 комплектов · Доставка по России</span>
        </div>
      </Container>
    </footer>
  );
}
