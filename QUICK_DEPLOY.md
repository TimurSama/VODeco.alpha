# ⚡ Быстрый деплой VODeco MVP на Vercel

## 🎯 Минимальные шаги (5 минут)

### 1. GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/ВАШ-USERNAME/vod-eco-mvp.git
git push -u origin main
```

### 2. Vercel
1. [vercel.com](https://vercel.com) → **"Add New Project"**
2. Выберите репозиторий `vod-eco-mvp`
3. **Storage** → **Create Database** → **Postgres** (Hobby план)
4. **Deploy** → Дождитесь завершения

**Готово!** `DATABASE_URL` добавится автоматически. Приложение работает с дефолтными настройками.

**Опционально** (после деплоя можно добавить):
- `NEWS_API_KEY` - если хотите использовать NewsAPI
- `NEXT_PUBLIC_APP_URL` - URL вашего проекта (можно добавить после первого деплоя)

### 3. Миграции (после первого деплоя)
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
```

### 4. Готово! 🎉
Откройте: `https://ваш-проект.vercel.app`

---

## 📋 Полная инструкция
См. [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md)
