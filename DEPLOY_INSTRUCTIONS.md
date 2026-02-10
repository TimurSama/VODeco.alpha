# 🚀 Пошаговая инструкция по деплою VODeco MVP на Vercel

## ✅ Статус: Сборка успешна, готово к деплою

---

## 📋 Шаг 1: Подготовка GitHub репозитория

### 1.1. Проверьте `.gitignore`

Убедитесь, что в `.gitignore` есть:
```
.env
.env.local
.env*.local
node_modules
.next
.vercel
*.db
*.db-journal
prisma/dev.db
```

### 1.2. Инициализируйте Git (если еще не сделано)

```bash
cd "W:\1 VODeco\vod-eco-mvp"
git init
git add .
git commit -m "Initial commit: VODeco MVP ready for deployment"
```

### 1.3. Создайте репозиторий на GitHub

1. Перейдите на [github.com](https://github.com)
2. Нажмите **"New repository"**
3. Название: `vod-eco-mvp` (или другое)
4. Выберите **Public** или **Private**
5. **НЕ** добавляйте README, .gitignore или лицензию (уже есть)
6. Нажмите **"Create repository"**

### 1.4. Подключите локальный репозиторий к GitHub

```bash
git remote add origin https://github.com/ВАШ-USERNAME/vod-eco-mvp.git
git branch -M main
git push -u origin main
```

**Примечание:** Замените `ВАШ-USERNAME` на ваш GitHub username.

---

## 📋 Шаг 2: Настройка Vercel

### 2.1. Войдите в Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите **"Sign Up"** или **"Log In"**
3. Выберите **"Continue with GitHub"**
4. Разрешите доступ к репозиториям

### 2.2. Создайте новый проект

1. В Vercel Dashboard нажмите **"Add New..."** → **"Project"**
2. Найдите репозиторий `vod-eco-mvp` в списке
3. Нажмите **"Import"**

### 2.3. Настройте проект

**Framework Preset:** `Next.js` (автоматически определяется)

**Root Directory:** `./` (оставьте по умолчанию)

**Build Command:** Оставьте по умолчанию (Vercel автоматически использует `npm run build`)

**Output Directory:** Оставьте по умолчанию (`.next`)

**Install Command:** Оставьте по умолчанию (`npm install`)

**⚠️ НЕ нажимайте "Deploy" пока!** Сначала нужно настроить переменные окружения.

---

## 📋 Шаг 3: Создание PostgreSQL базы данных

### 3.1. Создайте базу данных в Vercel

1. В Vercel Dashboard откройте ваш проект
2. Перейдите в **"Storage"** (в меню слева)
3. Нажмите **"Create Database"**
4. Выберите **"Postgres"**
5. Выберите план (для начала подойдет **Hobby** - бесплатный)
6. Нажмите **"Create"**
7. Vercel автоматически создаст базу и добавит `DATABASE_URL` в переменные окружения

**Примечание:** Запомните название вашей базы данных (например, `vodeco-db`).

---

## 📋 Шаг 4: Настройка переменных окружения

### ⚠️ ВАЖНО: API ключи настраиваются ТОЛЬКО в Vercel!

**Все API ключи и секреты настраиваются через Vercel Dashboard, а НЕ в коде приложения!**

Это безопасно, потому что:
- ✅ Ключи хранятся в зашифрованном виде
- ✅ Не попадают в Git репозиторий
- ✅ Доступны только на сервере (не в браузере)
- ✅ Можно менять без изменения кода

### 4.1. Откройте настройки переменных

1. В Vercel Dashboard → ваш проект → **"Settings"**
2. В меню слева выберите **"Environment Variables"**

### 4.2. Проверьте автоматически добавленные переменные

После создания PostgreSQL базы данных, Vercel автоматически добавит:
- ✅ `DATABASE_URL` - уже готово!

**Для тестовой версии этого достаточно!** Приложение будет работать с дефолтными настройками.

### 4.3. Опциональные переменные (добавьте при необходимости)

**Все эти переменные добавляются в Vercel Dashboard → Settings → Environment Variables:**

Если хотите настроить дополнительные функции, добавьте:

#### ⚙️ NEXT_PUBLIC_APP_URL (опционально, можно добавить после деплоя)

```
Key: NEXT_PUBLIC_APP_URL
Value: https://ваш-проект.vercel.app
Environment: Production, Preview, Development
```

**Примечание:** Замените `ваш-проект` на название вашего проекта в Vercel. Можно добавить после первого деплоя.

#### ✅ DATABASE_URL (автоматически)

```
Key: DATABASE_URL
Value: [уже добавлен автоматически при создании Postgres]
Environment: Production, Preview, Development
```

**Проверьте:** Должен быть автоматически добавлен после создания базы данных.

#### ⚙️ JWT_SECRET (опционально, для продакшена)

```
Key: JWT_SECRET
Value: [любая случайная строка, минимум 32 символа]
Environment: Production, Preview, Development
```

**Примечание:** Для тестовой версии не обязателен - приложение использует дефолтный ключ. Добавьте свой для продакшена.

#### ⚙️ NEWS_API_KEY (опционально, если используете NewsAPI)

```
Key: NEWS_API_KEY
Value: [ваш ключ от newsapi.org]
Environment: Production, Preview, Development
```

**Как получить:**
1. Зарегистрируйтесь на [newsapi.org](https://newsapi.org)
2. Получите бесплатный API ключ
3. Скопируйте ключ

#### ⚙️ TELEGRAM_BOT_TOKEN (опционально, если используете Telegram Mini App)

```
Key: TELEGRAM_BOT_TOKEN
Value: [ваш токен от @BotFather]
Environment: Production, Preview, Development
```

**Как получить:**
1. Откройте Telegram
2. Найдите бота [@BotFather](https://t.me/BotFather)
3. Отправьте `/newbot`
4. Следуйте инструкциям
5. Скопируйте токен (формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

---

## 📋 Шаг 5: Первый деплой

### 5.1. Запустите деплой

1. Вернитесь в **"Deployments"** (или на главную страницу проекта)
2. Нажмите **"Deploy"** (если еще не нажали)
3. Дождитесь завершения сборки (обычно 2-5 минут)

### 5.2. Проверьте логи

1. В процессе деплоя нажмите на разворачивающийся лог
2. Убедитесь, что:
   - ✅ `prisma generate` выполнен успешно
   - ✅ `next build` выполнен успешно
   - ✅ Нет критических ошибок

**Если есть ошибки:**
- Проверьте, что все переменные окружения добавлены
- Проверьте логи на наличие конкретных ошибок

---

## 📋 Шаг 6: Применение миграций базы данных

### 6.1. Установите Vercel CLI (если еще не установлен)

```bash
npm install -g vercel
```

### 6.2. Войдите в Vercel CLI

```bash
vercel login
```

### 6.3. Подключите проект

```bash
cd "W:\1 VODeco\vod-eco-mvp"
vercel link
```

Следуйте инструкциям:
- Выберите ваш проект
- Выберите scope (ваш аккаунт)

### 6.4. Скачайте переменные окружения

```bash
vercel env pull .env.local
```

Это создаст файл `.env.local` с переменными из Vercel.

### 6.5. Примените миграции

```bash
npx prisma migrate deploy
```

**Ожидаемый результат:**
```
✔ Generated Prisma Client
✔ Applied migration: 20240101000000_init
```

### 6.6. (Опционально) Загрузите тестовые данные

```bash
npm run db:seed
```

**Примечание:** Это загрузит тестовые данные (проекты, миссии, достижения). Используйте только для тестирования.

---

## 📋 Шаг 7: Проверка работы приложения

### 7.1. Откройте приложение

1. В Vercel Dashboard → ваш проект → **"Deployments"**
2. Найдите последний успешный деплой
3. Нажмите на ссылку (например, `https://vod-eco-mvp.vercel.app`)

### 7.2. Проверьте основные страницы

Откройте в браузере:
- ✅ `/` - главная страница
- ✅ `/dashboard` - дашборд с глобусом
- ✅ `/projects` - список проектов
- ✅ `/missions` - миссии
- ✅ `/library` - библиотека
- ✅ `/feed` - социальная лента

### 7.3. Проверьте API endpoints

Откройте в браузере:
- ✅ `https://ваш-проект.vercel.app/api/projects` - должен вернуть JSON
- ✅ `https://ваш-проект.vercel.app/api/missions` - должен вернуть JSON
- ✅ `https://ваш-проект.vercel.app/api/water-resources` - должен вернуть JSON

### 7.4. Проверьте работу базы данных

1. В Vercel Dashboard → **"Storage"** → ваша база данных
2. Откройте **"Data"** или **"Tables"**
3. Убедитесь, что таблицы созданы (User, Project, Mission, и т.д.)

---

## 📋 Шаг 8: Настройка домена (опционально)

### 8.1. Добавьте кастомный домен

1. В Vercel Dashboard → ваш проект → **"Settings"** → **"Domains"**
2. Введите ваш домен (например, `vodeco.com`)
3. Нажмите **"Add"**

### 8.2. Настройте DNS

Следуйте инструкциям Vercel:
1. Добавьте CNAME запись в DNS вашего домена
2. Укажите значение, которое даст Vercel
3. Дождитесь проверки (обычно несколько минут)

### 8.3. Обновите NEXT_PUBLIC_APP_URL

После настройки домена:
1. В Vercel Dashboard → **"Settings"** → **"Environment Variables"**
2. Найдите `NEXT_PUBLIC_APP_URL`
3. Измените значение на ваш домен (например, `https://vodeco.com`)
4. Перезапустите деплой

---

## ✅ Чеклист готовности к деплою

- [ ] Git репозиторий создан и запушен на GitHub
- [ ] Vercel проект создан и подключен к GitHub
- [ ] PostgreSQL база данных создана в Vercel
- [ ] `DATABASE_URL` добавлен автоматически ✅
- [ ] Первый деплой выполнен успешно
- [ ] Миграции применены (`npx prisma migrate deploy`)
- [ ] Приложение открывается и работает
- [ ] API endpoints отвечают корректно
- [ ] База данных содержит таблицы

**Опционально (для продакшена):**
- [ ] `JWT_SECRET` добавлен (для безопасности)
- [ ] `NEWS_API_KEY` добавлен (если используете NewsAPI)
- [ ] `NEXT_PUBLIC_APP_URL` добавлен (после деплоя)

---

## 🔧 Troubleshooting

### Ошибка: "JWT_SECRET is required in production"

**Решение:** Эта ошибка больше не должна появляться. Приложение использует дефолтный ключ для тестирования. Для продакшена добавьте свой `JWT_SECRET` в Environment Variables.

### Ошибка: "DATABASE_URL is not set"

**Решение:**
1. Создайте PostgreSQL базу данных в Vercel Storage
2. Убедитесь, что `DATABASE_URL` автоматически добавлен
3. Если не добавлен, добавьте вручную в Environment Variables

### Ошибка миграций

**Решение:**
```bash
# Локально
vercel env pull .env.local
npx prisma migrate deploy

# Или через Vercel CLI
vercel exec "npx prisma migrate deploy"
```

### Build ошибка на Vercel

**Решение:**
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все зависимости в `package.json`
3. Проверьте версию Node.js (должна быть 20+)
4. Убедитесь, что сборка проходит локально: `npm run build`

### Приложение не открывается

**Решение:**
1. Проверьте логи в Vercel Dashboard → Functions → Logs
2. Убедитесь, что все переменные окружения добавлены
3. Проверьте, что миграции применены
4. Попробуйте перезапустить деплой

---

## 📞 Дополнительная помощь

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Prisma Documentation:** [prisma.io/docs](https://www.prisma.io/docs)
- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)

---

## 🎉 Готово!

После выполнения всех шагов ваше приложение VODeco MVP будет доступно по адресу:
`https://ваш-проект.vercel.app`

**Следующие шаги:**
1. Протестируйте все функции приложения
2. Настройте мониторинг (опционально)
3. Настройте кастомный домен (опционально)
4. Начните привлекать пользователей! 🚀
