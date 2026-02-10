# Исправление ошибки деплоя на Vercel

## Проблема

```
Error: Environment variable not found: DATABASE_URL.
```

Эта ошибка возникает потому, что Prisma пытается валидировать схему во время `prisma generate`, но `DATABASE_URL` ещё не доступен.

## Решение

### Вариант 1: Убрать migrate deploy из buildCommand (рекомендуется)

Миграции будут выполняться автоматически при первом запросе к API или вручную.

**Изменения:**
- `vercel.json`: убрал `prisma migrate deploy` из `buildCommand`
- Теперь: `prisma generate && next build`

**Миграции выполняются:**
1. Автоматически при первом API запросе (если добавить проверку)
2. Вручную через Vercel CLI: `vercel env pull && npx prisma migrate deploy`
3. Или через отдельный скрипт после деплоя

### Вариант 2: Выполнить миграции вручную после первого деплоя

1. После успешного деплоя:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

2. Или через Vercel Dashboard → Functions → добавить отдельную функцию для миграций

### Вариант 3: Использовать Vercel Post-Deploy Hook

Создать API endpoint для выполнения миграций:

```typescript
// app/api/admin/migrate/route.ts
// Защитить паролем или токеном!
```

---

## Текущая конфигурация

**vercel.json:**
```json
{
  "buildCommand": "prisma generate && next build"
}
```

**package.json:**
```json
{
  "scripts": {
    "vercel-build": "prisma generate && next build"
  }
}
```

---

## Инструкция для деплоя

1. **Убедитесь, что DATABASE_URL добавлен в Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Добавьте `DATABASE_URL` (автоматически при создании Postgres)

2. **Деплой:**
   - Vercel автоматически выполнит `prisma generate && next build`
   - Миграции можно выполнить вручную после деплоя

3. **Выполнить миграции (после первого деплоя):**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

---

## Альтернатива: Автоматические миграции при первом запросе

Можно добавить проверку в API middleware:

```typescript
// src/lib/db/ensure-migrations.ts
// Проверяет и выполняет миграции при необходимости
```

Но это не рекомендуется для продакшена - лучше выполнять миграции вручную или через CI/CD.

---

**Статус:** Исправлено - buildCommand обновлён
