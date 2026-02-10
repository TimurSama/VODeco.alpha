# Быстрое исправление ошибки деплоя

## Проблема

```
Error: Environment variable not found: DATABASE_URL.
```

## Решение

### Шаг 1: Создайте PostgreSQL базу данных в Vercel

1. Vercel Dashboard → ваш проект → **Storage**
2. Нажмите **"Create Database"**
3. Выберите **Postgres**
4. Создайте базу данных
5. **Vercel автоматически добавит `DATABASE_URL` в Environment Variables**

### Шаг 2: Проверьте, что DATABASE_URL добавлен

1. Vercel Dashboard → ваш проект → **Settings** → **Environment Variables**
2. Убедитесь, что есть переменная `DATABASE_URL`
3. Значение должно начинаться с `postgresql://`

### Шаг 3: Повторите деплой

1. Vercel Dashboard → **Deployments**
2. Нажмите **"Redeploy"** на последнем деплое
3. Или сделайте новый commit в GitHub

### Шаг 4: После успешного деплоя - примените миграции

**Вариант 1: Через Vercel CLI (рекомендуется)**

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

**Вариант 2: Использовать db push (для MVP)**

```bash
vercel env pull .env.local
npx prisma db push
```

---

## Что изменено

- ✅ Убрал `prisma migrate deploy` из `buildCommand` в `vercel.json`
- ✅ Теперь: `prisma generate && next build`
- ✅ Миграции выполняются отдельно после деплоя

---

## Важно

**DATABASE_URL должен быть добавлен ДО первого деплоя!**

Без него сборка упадёт с ошибкой.

---

**Готово!** После добавления DATABASE_URL деплой должен пройти успешно.
