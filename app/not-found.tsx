import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center">
      <Container>
        <div className="text-center">
          <div className="font-display text-7xl font-extrabold text-red">404</div>
          <h1 className="mt-4 font-display text-2xl font-bold uppercase text-ink">Страница не найдена</h1>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-red px-7 font-semibold text-white"
          >
            На главную
          </Link>
        </div>
      </Container>
    </main>
  );
}
