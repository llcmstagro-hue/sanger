'use client';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { leadSchema, type LeadInput } from '@/lib/validation';
import { useStudio } from '@/store/studioStore';
import { track } from '@/lib/analytics';
import { getUtm } from '@/lib/utm';
import { SPORTS } from '@/lib/sports';
import type { SportSlug } from '@/types';

const fieldCls =
  'w-full rounded-xl border border-line2 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-none';
const errCls = 'mt-1 text-[12.5px] text-red';

export function LeadForm({ landing, defaultSport }: { landing: string; defaultSport?: SportSlug }) {
  const studio = useStudio();
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const opened = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      sport: defaultSport ? SPORTS[defaultSport].name : '',
      quantity: '5',
      consent: false as unknown as true,
    },
  });

  useEffect(() => {
    const el = document.getElementById('lead');
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !opened.current) {
          opened.current = true;
          track('estimate_form_open', { landing });
        }
      });
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [landing]);

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setLogo(String(r.result));
      setValue('logo', String(r.result));
    };
    r.readAsDataURL(f);
  };

  const onSubmit = async (data: LeadInput) => {
    setServerError(null);
    track('lead_submit', { landing });
    const payload: LeadInput = {
      ...data,
      logo: logo ?? studio.logo,
      landing,
      studio: {
        sport: studio.sport,
        template: studio.template,
        baseColor: studio.baseColor,
        accentColor: studio.accentColor,
        surname: studio.surname,
        number: studio.number,
      },
      utm: getUtm(),
    };
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('server');
      setDone(true); // успех показываем ТОЛЬКО после ответа сервера
      track('lead_success', { landing });
    } catch {
      setServerError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
    }
  };

  return (
    <section className="py-16 sm:py-24" id="lead">
      <Container>
        <SectionHeading eyebrow="Заявка" title={<>Получить расчёт</>}>
          Оставьте контакты — подготовим индивидуальное предложение под вашу команду.
        </SectionHeading>

        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-6 sm:p-8">
          {done ? (
            <div className="py-10 text-center" role="status" aria-live="polite">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">Проект отправлен</h3>
              <p className="mt-2 text-[15px] text-muted">
                Наш дизайнер подготовит профессиональную визуализацию и свяжется с вами.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="l-name" className="mb-1.5 block text-[13px] font-medium text-ink">Имя *</label>
                <input id="l-name" className={fieldCls} placeholder="Как к вам обращаться" {...register('name')} />
                {errors.name && <p className={errCls}>{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="l-phone" className="mb-1.5 block text-[13px] font-medium text-ink">Телефон *</label>
                <input id="l-phone" inputMode="tel" className={fieldCls} placeholder="+7 (___) ___-__-__" {...register('phone')} />
                {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="l-email" className="mb-1.5 block text-[13px] font-medium text-ink">E-mail</label>
                <input id="l-email" inputMode="email" className={fieldCls} placeholder="team@mail.ru" {...register('email')} />
                {errors.email && <p className={errCls}>{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="l-city" className="mb-1.5 block text-[13px] font-medium text-ink">Город</label>
                <input id="l-city" className={fieldCls} placeholder="Город" {...register('city')} />
              </div>
              <div>
                <label htmlFor="l-sport" className="mb-1.5 block text-[13px] font-medium text-ink">Вид спорта *</label>
                <select id="l-sport" className={fieldCls} {...register('sport')}>
                  <option value="">Выберите вид спорта</option>
                  {Object.values(SPORTS).map((s) => (
                    <option key={s.slug} value={s.name}>{s.name}</option>
                  ))}
                  <option value="Другое">Другое</option>
                </select>
                {errors.sport && <p className={errCls}>{errors.sport.message}</p>}
              </div>
              <div>
                <label htmlFor="l-qty" className="mb-1.5 block text-[13px] font-medium text-ink">Количество комплектов *</label>
                <input id="l-qty" inputMode="numeric" className={fieldCls} placeholder="5" {...register('quantity')} />
                {errors.quantity && <p className={errCls}>{errors.quantity.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="l-comment" className="mb-1.5 block text-[13px] font-medium text-ink">Комментарий</label>
                <textarea id="l-comment" rows={3} className={fieldCls} placeholder="Пожелания к дизайну, сроки, вопросы" {...register('comment')} />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="min-h-[46px] rounded-xl border border-line2 px-4 text-[14px] font-medium text-ink hover:border-ink"
                >
                  {logo ? 'Логотип приложен ✓' : 'Прикрепить логотип'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onLogo} aria-label="Логотип" />
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-start gap-3 text-[13px] text-muted">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 accent-red" {...register('consent')} />
                  <span>Согласен на обработку персональных данных</span>
                </label>
                {errors.consent && <p className={errCls}>{errors.consent.message}</p>}
              </div>
              {serverError && (
                <p className="sm:col-span-2 rounded-lg bg-red-50 px-4 py-3 text-[13.5px] text-red" role="alert">
                  {serverError}
                </p>
              )}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-[54px] w-full items-center justify-center rounded-full bg-red text-[15px] font-semibold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-red-600 disabled:opacity-60"
                >
                  {isSubmitting ? 'Отправляем…' : 'Получить расчёт'}
                </button>
                <p className="mt-3 text-center text-[12px] text-muted">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </div>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
