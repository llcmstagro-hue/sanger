# SANGER — сайт производителя командной спортивной формы

Премиальный сайт на **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Zustand + React Hook Form + Zod**. Пять рекламных посадочных страниц под виды спорта, общая дизайн-система, простая онлайн-«Студия дизайна», форма заявки с серверным endpoint, аналитика, SEO, тесты Playwright.

Белая тема эталона: фон `#FAFAF8`, текст `#111111`, единый акцент — красный `#E4141C`.

## Деплой (публичная ссылка)

Проект — обычный Next.js, деплоится на Vercel без настройки (env-переменные для показа не нужны).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/llcmstagro-hue/sanger)

Вручную: [vercel.com/new](https://vercel.com/new) → войти через GitHub → импортировать `llcmstagro-hue/sanger` → выбрать ветку → **Deploy**. Через ~минуту будет ссылка вида `sanger-xxx.vercel.app`; каждый `git push` в ветку деплоится автоматически.

## Запуск

```bash
npm install
cp .env.example .env.local   # заполните при необходимости (можно оставить пустым для дева)
npm run dev                  # http://localhost:3000
```

Продакшн:

```bash
npm run build
npm run start
```

Проверки:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run test        # Playwright (поднимает dev-сервер сам)
```

## Маршруты

| URL | Назначение |
|-----|-----------|
| `/` | Универсальная главная: виды спорта, работы (фильтры), студия, форма |
| `/hockey` | Хоккей — посадочная под Яндекс.Директ |
| `/football` | Футбол |
| `/volleyball` | Волейбол |
| `/basketball` | Баскетбол |
| `/mma` | MMA |
| `/about`, `/contacts` | О компании, Контакты |
| `/api/lead` | POST — приём заявки (Telegram/CRM) |
| `/sitemap.xml`, `/robots.txt` | генерируются автоматически |

Пять страниц строятся из одного маршрута `app/[sport]/page.tsx` через `generateStaticParams` — общая структура, контент/тексты/H1/SEO берутся из `lib/sports.ts`. Каждая кампания Директа ведёт на свой URL: «хоккейная форма на заказ» → `/hockey`.

## Структура

```
app/
  layout.tsx            шрифты (Montserrat/Manrope), метрика, UTM
  page.tsx              главная
  [sport]/page.tsx      5 посадочных (metadata + JSON-LD + FAQ schema)
  about, contacts       статические страницы
  api/lead/route.ts     серверный endpoint заявки
  sitemap.ts, robots.ts SEO
components/
  layout/               Header (компактится при скролле), MobileMenu, Footer, Logo
  home/                 HomeHero, SportsGrid, WorksGallery (фильтры)
  sports/               Hero, Advantages, Assortment, Works, Production,
                        WhySanger, OrderSteps, Accessories, Faq, WorkCard, PageView
  studio/               Studio, StudioControls, Jersey (SVG)
  forms/                LeadForm (RHF + Zod)
  ui/                   Button, Container, SectionHeading, Placeholder
  motion/               Reveal, AnalyticsProvider
lib/                    sports, jersey, analytics, utm, validation, telegram, cn
store/                  studioStore (Zustand)
types/                  общие типы
tests/e2e/              smoke, studio, form (Playwright)
public/assets/          сюда кладутся реальные WebP/AVIF (сейчас — плейсхолдеры)
```

## Студия дизайна

Простой рекламный конструктор (не CAD): вид спорта, шаблон, основной/дополнительный цвет, логотип (загрузка), фамилия, номер, вид спереди/сзади, «Получить расчёт». Состояние — Zustand (`store/studioStore.ts`), форма — SVG (`lib/jersey.ts`). Конфигурация студии уходит в заявку. На мобиле — панель в bottom-sheet, закреплённая кнопка расчёта, переключатель спереди/сзади.

Кнопка «Использовать как шаблон» в галерее открывает Студию с пресетом (цвета/номер/название команды).

## Форма и серверный endpoint

`components/forms/LeadForm.tsx` — валидация Zod, поля: имя, телефон, e-mail, город, вид спорта, количество, комментарий, логотип, согласие. Успех показывается **только после ответа сервера** (`ok: true`); при ошибке — понятное сообщение, ложного успеха нет.

`/api/lead` валидирует payload и отправляет в Telegram и/или CRM. **Секреты только в env, в клиент не попадают:**

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
CRM_WEBHOOK_URL=...
```

Без токенов заявка всё равно принимается (в дев-режиме пишется в лог сервера).

## Аналитика (Яндекс.Метрика)

`lib/analytics.ts` — единый `track(event, params)`. События: `sport_page_view`, `create_form_click`, `studio_open`, `template_selected`, `color_changed`, `logo_uploaded`, `surname_entered`, `number_entered`, `estimate_form_open`, `lead_submit`, `lead_success`, `phone_click`, `messenger_click`.

UTM-метки захватываются на входе и хранятся в `sessionStorage` всю сессию (`lib/utm.ts`), затем уходят в заявку. Метрика подключается только если задан `NEXT_PUBLIC_YM_ID`.

## SEO

Уникальные title/description и один H1 на страницу, canonical, Open Graph, JSON-LD (`Product` + `FAQPage`), `sitemap.xml`, `robots.txt`, alt у изображений, ЧПУ-адреса.

## Производительность

Тяжёлые части (Студия, Framer Motion) — клиентские и грузятся по месту; секции ниже первого экрана появляются по `whileInView`; `next/font` со `swap`; уважается `prefers-reduced-motion`; композиция плейсхолдеров фиксирует размеры (без CLS). Цели: Lighthouse desktop 90+, mobile 80+, LCP < 2.5s, CLS < 0.1.

## Изображения

Сейчас во всех фото-блоках — аккуратные плейсхолдеры (`components/ui/Placeholder.tsx`), сохраняющие размеры и композицию макета. Замена на реальные фото: положите WebP/AVIF в `public/assets/` и подставьте `next/image` вместо `Placeholder` — вёрстка не меняется.

## Что осталось сделать вам (см. REPORT.md)

Проект собран как исходный код. В окружении, где он готовился, `npm` был недоступен, поэтому `npm install`, `dev`, `build` и Playwright нужно запустить у себя (в Claude Code / локально). Дизайн белого эталона проверен визуально — `preview/visual-mirror.html` и скриншоты.
