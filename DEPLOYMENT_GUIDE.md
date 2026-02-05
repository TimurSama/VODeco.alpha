# Руководство по развертыванию VODeco MVP

## 🚀 Деплой на Vercel (GitHub + Vercel)

### Шаг 1: Подготовка локально

1. **Создайте файл `.env.local`** по списку из `ENV_VARIABLES_LIST.md`.

2. **Настройте переменные окружения в `.env.local`**:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
JWT_SECRET="ваш-секретный-ключ-минимум-32-символа"
JWT_EXPIRES_IN="7d"
TELEGRAM_BOT_TOKEN="ваш-токен-бота"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEWS_API_KEY="ваш-ключ-newsapi"
```

3. **Запустите миграции базы данных**:
```bash
npx prisma migrate dev --name init
```

4. **Запустите seed для заполнения тестовыми данными**:
```bash
npm run db:seed
```

5. **Проверьте локально**:
```bash
npm run dev
```

### Шаг 2: Подготовка GitHub репозитория

1. **Создайте `.gitignore`** (если еще нет):
```gitignore
# Environment variables
.env
.env.local
.env*.local

# Database
*.db
*.db-journal
prisma/dev.db
prisma/dev.db-journal

# Dependencies
node_modules
.next
.vercel

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

2. **Инициализируйте Git** (если еще не сделано):
```bash
git init
git add .
git commit -m "Initial commit: VODeco MVP"
```

3. **Создайте репозиторий на GitHub** и запушьте:
```bash
git remote add origin https://github.com/your-username/vod-eco-mvp.git
git branch -M main
git push -u origin main
```

### Шаг 3: Деплой на Vercel

1. **Перейдите на [vercel.com](https://vercel.com)** и войдите через GitHub

2. **Нажмите "New Project"** и выберите ваш репозиторий

3. **Настройте проект**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (по умолчанию)
   - Build Command: `npm run build` (автоматически)
   - Output Directory: `.next` (автоматически)

4. **Добавьте переменные окружения в Vercel**:
   - Перейдите в Settings → Environment Variables
   - Добавьте следующие переменные:

```
DATABASE_URL=postgresql://... (Vercel создаст автоматически при добавлении Postgres)
JWT_SECRET=ваш-секретный-ключ-минимум-32-символа-случайный
JWT_EXPIRES_IN=7d
TELEGRAM_BOT_TOKEN=ваш-токен-бота
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NODE_ENV=production
```

5. **Добавьте PostgreSQL базу данных**:
   - В Vercel Dashboard → Storage → Create Database
   - Выберите **Postgres**
   - Создайте базу данных
   - Vercel автоматически добавит `DATABASE_URL` в переменные окружения

6. **Обновите `vercel.json`** для работы с PostgreSQL:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "PRISMA_GENERATE_DATAPROXY": "false"
  }
}
```

7. **Деплой**:
   - Нажмите "Deploy"
   - Vercel автоматически соберет и задеплоит проект

8. **После первого деплоя, запустите миграции**:
   - В Vercel Dashboard → ваша функция → Logs
   - Или через Vercel CLI:
   ```bash
   npx vercel env pull .env.local
   npx prisma migrate deploy
   ```

9. **Запустите seed** (опционально, только для тестовых данных):
   ```bash
   npm run db:seed
   ```

### Шаг 4: Настройка домена (опционально)

1. В Vercel Dashboard → Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel

---

## 🔄 Миграция на собственный сервер (будущее)

### Вариант 1: VPS (DigitalOcean, Hetzner, AWS EC2)

#### Требования:
- Ubuntu 20.04+ или Debian 11+
- Node.js 20+
- PostgreSQL 14+
- Nginx (для reverse proxy)
- PM2 (для управления процессами)
- SSL сертификат (Let's Encrypt)

#### Шаги:

1. **Подготовка сервера**:
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Установка Nginx
sudo apt install -y nginx

# Установка PM2
sudo npm install -g pm2
```

2. **Настройка PostgreSQL**:
```bash
sudo -u postgres psql
CREATE DATABASE vodeco;
CREATE USER vodeco_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE vodeco TO vodeco_user;
\q
```

3. **Клонирование репозитория**:
```bash
cd /var/www
sudo git clone https://github.com/your-username/vod-eco-mvp.git
cd vod-eco-mvp
sudo chown -R $USER:$USER .
npm install
```

4. **Настройка переменных окружения**:
```bash
# Создайте .env по списку из ENV_VARIABLES_LIST.md
nano .env
# Настройте все переменные, особенно DATABASE_URL
```

5. **Миграции и seed**:
```bash
npx prisma migrate deploy
npm run db:seed
```

6. **Сборка проекта**:
```bash
npm run build
```

7. **Запуск с PM2**:
```bash
pm2 start npm --name "vodeco" -- start
pm2 save
pm2 startup
```

8. **Настройка Nginx**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. **SSL сертификат**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Вариант 2: Docker (рекомендуется)

1. **Создайте `Dockerfile`**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Создайте `docker-compose.yml`**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://vodeco:password@db:5432/vodeco
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=vodeco
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=vodeco
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. **Запуск**:
```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
```

---

## 📋 Чеклист перед деплоем

- [ ] Все переменные окружения настроены
- [ ] `.env` файлы в `.gitignore`
- [ ] База данных настроена (локально и на продакшене)
- [ ] Миграции выполнены
- [ ] Seed данные загружены (опционально)
- [ ] Тесты пройдены локально
- [ ] Build проходит успешно
- [ ] SSL сертификат настроен (для продакшена)
- [ ] Мониторинг настроен (опционально)

---

## 🔐 Безопасность

1. **Никогда не коммитьте `.env` файлы**
2. **Используйте сильные JWT_SECRET** (минимум 32 символа, случайные)
3. **Настройте CORS** для API
4. **Используйте HTTPS** в продакшене
5. **Регулярно обновляйте зависимости**: `npm audit fix`

---

## 📊 Мониторинг (опционально)

- **Vercel Analytics** (встроено)
- **Sentry** для отслеживания ошибок
- **LogRocket** для сессий пользователей
- **Uptime Robot** для мониторинга доступности

---

## 🆘 Troubleshooting

### Ошибка подключения к базе данных
- Проверьте `DATABASE_URL`
- Убедитесь, что база данных доступна
- Проверьте firewall правила

### Ошибки миграций
```bash
# Сброс миграций (ОСТОРОЖНО: удалит данные)
npx prisma migrate reset

# Создание новой миграции
npx prisma migrate dev --name migration-name
```

### Проблемы с build на Vercel
- Проверьте логи в Vercel Dashboard
- Убедитесь, что все зависимости в `package.json`
- Проверьте версию Node.js (должна быть 20+)

---

## 📝 Примечания

- **Vercel** отлично подходит для MVP и начала работы
- **Собственный сервер** даст больше контроля и может быть дешевле при масштабировании
- **Миграция** с Vercel на собственный сервер проста: просто измените `DATABASE_URL` и переменные окружения
