# Текущая реализация MVP (`vod-eco-mvp`): карта функций

Цель документа — зафиксировать **что реально реализовано** в MVP на уровне кода, чтобы WhitePaper/интерактивная страница не противоречили фактам.

## 1) Страницы (App Router)
Корневые страницы приложения находятся в `vod-eco-mvp/app/**`:
- `app/page.tsx` — входная страница
- `app/dashboard/page.tsx` — дашборд с 3D‑глобусом
- `app/wallet/page.tsx` — кошелёк (баланс/стейкинг)
- `app/projects/page.tsx` и `app/projects/[slug]/page.tsx` — хаб проектов и карточки
- `app/news/page.tsx` — новости
- `app/profile/page.tsx`, `app/settings/page.tsx`, `app/friends/page.tsx`, `app/groups/page.tsx`, `app/chats/page.tsx` — социальные разделы (каркас)

## 2) API эндпоинты (server routes)
В `vod-eco-mvp/app/api/**` реализованы:

### Аутентификация
- `POST /api/auth/telegram` — Telegram‑auth (валидирует hash, создаёт пользователя и кошелёк)

### Кошелёк и стейкинг
- `GET /api/wallet` — баланс, активные стейки, транзакции
- `POST /api/wallet/stake` — создать стейк в проект, списать баланс, увеличить funding проекта, записать транзакцию

### Проекты
- `GET /api/projects` — список активных проектов
- `GET /api/projects/[slug]` — детальная карточка по slug (если используется)

### Водные ресурсы
- `GET /api/water-resources` — ресурсы из БД с фильтрами
- `GET /api/water-resources?external=true` — дополнительно тянет внешние источники (OSM/USGS/WorldBank) и объединяет

### Новости
- `GET /api/news` — новости из БД, пагинация
- `GET /api/news?api=true` — агрегация с внешних источников, сохранение в БД, затем выдача из БД

## 3) Модель данных (Prisma)
Базовые сущности в `vod-eco-mvp/prisma/schema.prisma`:
- **Identity**: `User`
- **Экономика**: `Wallet`, `Transaction`, `Staking`, `Project`
- **Реестр воды**: `WaterResource`
- **Контент**: `NewsPost`, `Post`, `Comment`
- **Социальные**: `Friendship`, `Chat`, `ChatMember`, `Message`, `Group`, `GroupMember`
- **Мотивация**: `Achievement`, `UserAchievement`

## 4) Seed‑данные (демо‑реальность)
`vod-eco-mvp/prisma/seed.ts` создаёт:
- тест‑пользователя с балансом 10,000;
- проекты с `targetAmount/currentAmount/irr` и богатым `metadata` (milestones, stakingAPY и т.д.);
- несколько `WaterResource` (Арал, Амударья, насосная станция);
- ачивки;
- новости (2026) — как контент‑наполнение.

## 5) Токеномика в коде
`vod-eco-mvp/src/lib/tokenomics/calculations.ts` задаёт:
- базовую цену (через стоимость м³ воды),
- скидку,
- supply для MVP,
- таблицы APY по срокам и типам,
- калькуляторы покупки/стейкинга/доходности проектов.

## 6) Внешние источники данных
По `README_API.md` и `README_API_INTEGRATIONS.md` уже есть интеграции:
- World Bank Water Data API
- USGS Water Services API
- OpenStreetMap Overpass API
- мульти‑источники новостей (UN/Greenpeace/WorldBank/UNESCO/EEA/NewsAPI/RSS fallback)

## 7) Пробелы/заглушки (важные для канона)
В API сейчас используются заглушки:
- `userId = 'test-user-id'` в wallet endpoints (нужно заменить на сессию/JWT)

Следствие: текущий MVP — “демо‑режим” без полноценной auth‑сессии.

