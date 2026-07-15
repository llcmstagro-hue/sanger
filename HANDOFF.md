# SANGER — состояние проекта и хендофф

Премиум-ребилд сайта производителя командной спортивной формы на заказ (B2B:
на форме — логотип **клиента**, не SANGER). Nike/Apple/Awwwards-уровень.

- **Репозиторий:** github.com/llcmstagro-hue/sanger
- **Рабочая ветка:** `claude/gotovo-spl632` (НЕ `main` — там старая версия)
- **Живой деплой (Netlify):** https://harmonious-lollipop-19146b.netlify.app/
  Production branch = `claude/gotovo-spl632`, авто-деплой при push включён.
- **Стек:** Next.js 14 (App Router) + TS + Tailwind + Framer Motion + GSAP + Lenis.

## Доступы (настроены)
- Сетевая политика окружения — Custom allowlist: `*.netlify.app`, `*.vercel.app`,
  `*.cloudfront.net`, `platform.higgsfield.ai`, `api.openai.com`,
  `images.unsplash.com`, `images.pexels.com` (+ дефолтные пакет-менеджеры).
  → в новой сессии можно открывать деплой и скачивать фото с CDN Higgsfield.
- Коннектор **higgsfield** подключён (генерация фото, Plus — без watermark).
- GitHub App «Claude» — read/write, push в репозиторий разрешён.

## Сделано (Слои 1–3)
- Дизайн-система + арт-дирекшн Hero (`components/hero/AtmosphereHero.tsx`,
  проп `imageSrc`): масочный релиз заголовка, дыхание, параллакс, тилт, живой
  свет, красная строчка, микрочастицы. Lenis + GSAP ScrollTrigger.
- Per-sport атмосфера (`lib/atmosphere.ts`): каждый спорт — своя кампания.
- Структура посадочных по ТЗ: Hero → Виды спорта → Преимущества → Ассортимент →
  Производство → Материалы → Как заказать → FAQ → Расчёт. Без «Наши работы» и
  без конструктора (он на отдельной странице `/studio`).
- Лента клиентских клубов, премиум-секции, GSAP-пиннинг «Производства», мобайл-доводка.
- **Реальные фото спортсменов** (Higgsfield Soul, без watermark) в героях всех
  6 страниц: `public/assets/hero/*.webp`.

## Что дальше
1. Открыть живой сайт (десктоп + мобайл 390px), оценить реальный рендер, собрать
   список несоответствий уровню Nike/Apple/Awwwards.
2. **Фото в секции** Производство/Материалы/Ассортимент: higgsfield Soul 2.0, 2k,
   тёмная форма с абстрактным крестом клиента (без читаемого текста/бренда,
   без watermark) → скачать по URL → `public/assets/` → заменить `<Placeholder/>`
   на `next/image`.
3. Доводка композиции/типографики/мобайла/конверсии.
4. По желанию — приём заявок в Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`),
   код в `app/api/lead/route.ts`.

## Правила
- Читай `.claude/skills/frontend-design` (арт-дирекшн) и `.claude/skills/web-app-testing`
  (запуск/тесты) перед работой.
- Перед коммитом: `npm run typecheck`, `npm run build`, e2e через
  `playwright.local.ts` (предустановленный Chromium — см. web-app-testing).
- Коммить и пушь в `claude/gotovo-spl632`; Netlify пересоберёт деплой сам.
- Проверяй фото/анимации в реальном браузере, а не только тестами.
