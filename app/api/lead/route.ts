import { NextResponse } from 'next/server';
import { leadSchema } from '@/lib/validation';
import { notifyTelegram, notifyCrm } from '@/lib/telegram';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    // Секреты берутся из process.env внутри этих функций и не покидают сервер.
    await Promise.allSettled([notifyTelegram(parsed.data), notifyCrm(parsed.data)]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[lead] error', e);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
