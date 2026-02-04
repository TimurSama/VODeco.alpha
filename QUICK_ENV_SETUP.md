# ⚡ Быстрая настройка Environment Variables

## 🎯 Минимальный набор (для запуска)

### 1. JWT_SECRET (ОБЯЗАТЕЛЬНО!)

```
Key: JWT_SECRET
Value: [сгенерируйте случайный ключ 32+ символа]
Environment: All (Production, Preview, Development)
```

**Сгенерировать ключ:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. JWT_EXPIRES_IN

```
Key: JWT_EXPIRES_IN
Value: 7d
Environment: All
```

### 3. NEXT_PUBLIC_APP_URL

```
Key: NEXT_PUBLIC_APP_URL
Value: https://vo-deco-alpha.vercel.app
Environment: All
```

**Примечание:** Замените на ваш реальный URL после деплоя

### 4. DATABASE_URL

**Автоматически** - создайте PostgreSQL в Vercel Storage

---

## 📍 Где добавить в Vercel

1. Vercel Dashboard → Ваш проект
2. **Settings** → **Environment Variables**
3. Нажмите **"Add New"**
4. Введите Key и Value
5. Выберите Environment (лучше "All")
6. Нажмите **"Save"**

---

## ✅ Чеклист

- [ ] JWT_SECRET добавлен
- [ ] JWT_EXPIRES_IN добавлен
- [ ] NEXT_PUBLIC_APP_URL добавлен
- [ ] PostgreSQL создан (DATABASE_URL автоматически)
- [ ] TELEGRAM_BOT_TOKEN добавлен (если используете)
- [ ] Проект передеплоен

---

## 🔄 После добавления

**Обязательно передеплойте проект!**

1. Deployments → последний деплой → "..." → "Redeploy"
2. Или сделайте новый commit в GitHub
