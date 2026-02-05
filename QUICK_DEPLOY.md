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
4. **Settings** → **Environment Variables** → Добавьте:

```
JWT_SECRET=ba0a89f5cdb813af31576f3889c601e6e435922c911f157faa58076e04294e51
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=https://ваш-проект.vercel.app
NODE_ENV=production
```

5. **Deploy** → Дождитесь завершения

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
