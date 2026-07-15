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

## Сделано (Слой 4 — секционные фото)
- Ветка: `claude/handoff-awwwards-polish-qm84tr` (ответвлена от `gotovo-spl632`).
- Сгенерированы через higgsfield Soul 2.0 (2k, Plus — без watermark) и вшиты
  вместо последних `<Placeholder/>` реальные фото (тёмная форма с абстрактным
  крестом клиента, без вордмарка SANGER и без чужих брендов):
  - Виды спорта — 5 карточек `public/assets/sports/*.webp`
    (hockey/football/volleyball/basketball/mma), hover-scale + нижний градиент.
  - Производство — 4 кадра `public/assets/production/*.webp`
    (ткань, пошив, нанесение, контроль/упаковка).
  - Аксессуары — `public/assets/accessories/{bag,cap}.webp`.
- typecheck + прод-сборка + e2e smoke (18/18) зелёные.
- ⚠️ Живой Netlify-деплой смотрит на `gotovo-spl632`. Чтобы фото появились на
  https://harmonious-lollipop-19146b.netlify.app/, нужно смёржить эту ветку в
  `gotovo-spl632` (или переключить production branch Netlify).

## Что дальше
1. Смёржить ветку в production-ветку Netlify, чтобы увидеть фото на живом деплое.
2. Дальнейшая доводка композиции/типографики/мобайла/конверсии.
3. По желанию — приём заявок в Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`),
   код в `app/api/lead/route.ts`.

## Правила
- Читай `.claude/skills/frontend-design` (арт-дирекшн) и `.claude/skills/web-app-testing`
  (запуск/тесты) перед работой.
- Перед коммитом: `npm run typecheck`, `npm run build`, e2e через
  `playwright.local.ts` (предустановленный Chromium — см. web-app-testing).
- Коммить и пушь в `claude/gotovo-spl632`; Netlify пересоберёт деплой сам.
- Проверяй фото/анимации в реальном браузере, а не только тестами.
