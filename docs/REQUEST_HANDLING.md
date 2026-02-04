# Обработка входящих запросов в VODeco

## 🌐 Архитектура обработки запросов

### Next.js App Router

Все запросы обрабатываются через **Next.js App Router**:

```
Входящий запрос
    ↓
Vercel Edge Network / Serverless Functions
    ↓
Next.js App Router
    ↓
API Routes (app/api/**/*.ts) или Pages (app/**/page.tsx)
    ↓
Обработка и ответ
```

## 📍 Где обрабатываются запросы

### 1. API Routes (Backend)

Все API эндпоинты находятся в `app/api/**/route.ts`:

```
app/api/
├── auth/
│   └── telegram/route.ts          → POST /api/auth/telegram
├── wallet/
│   ├── route.ts                    → GET /api/wallet
│   └── stake/route.ts              → POST /api/wallet/stake
├── missions/
│   ├── route.ts                    → GET/POST /api/missions
│   └── [id]/
│       ├── route.ts                → GET /api/missions/:id
│       └── submit/route.ts         → POST /api/missions/:id/submit
├── referrals/
│   ├── route.ts                    → GET /api/referrals
│   └── stats/route.ts              → GET /api/referrals/stats
├── social/
│   └── share/route.ts              → GET/POST /api/social/share
├── library/
│   └── route.ts                    → GET/POST /api/library
├── news/
│   ├── route.ts                    → GET /api/news
│   └── submit/route.ts             → POST /api/news/submit
├── user/
│   └── profile/route.ts            → GET /api/user/profile
└── ...
```

### 2. Страницы (Frontend)

Все страницы находятся в `app/**/page.tsx`:

```
app/
├── page.tsx                        → GET / (главная)
├── dashboard/page.tsx              → GET /dashboard
├── profile/page.tsx                → GET /profile
├── missions/page.tsx               → GET /missions
├── library/page.tsx                → GET /library
├── news/page.tsx                   → GET /news
└── ...
```

## 🔄 Поток обработки запроса

### Пример: GET /api/wallet

```
1. Запрос приходит на Vercel
   ↓
2. Vercel направляет в Next.js Serverless Function
   ↓
3. Next.js вызывает app/api/wallet/route.ts
   ↓
4. Middleware проверяет JWT токен (requireAuth)
   ↓
5. Извлекается userId из токена
   ↓
6. Запрос к базе данных через Prisma
   ↓
7. Формируется ответ (JSON)
   ↓
8. Ответ отправляется клиенту
```

### Пример: POST /api/missions/:id/submit

```
1. Запрос с данными приходит на Vercel
   ↓
2. Next.js вызывает app/api/missions/[id]/submit/route.ts
   ↓
3. Проверка аутентификации
   ↓
4. Валидация входных данных
   ↓
5. Бизнес-логика (создание submission)
   ↓
6. Запись в базу данных
   ↓
7. Расчет вознаграждений (tokenomics)
   ↓
8. Ответ клиенту
```

## 🛡️ Middleware и безопасность

### JWT Аутентификация

Все защищенные API используют middleware:

```typescript
// src/lib/auth/middleware.ts
export async function requireAuth(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { user };
}
```

### Использование в API:

```typescript
// app/api/wallet/route.ts
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Ошибка аутентификации
  }
  const { user } = authResult;
  // Продолжаем обработку...
}
```

## 📊 Типы запросов

### 1. Публичные запросы (без аутентификации)
- `GET /api/missions` - список миссий
- `GET /api/news` - новости
- `GET /api/library` - библиотека
- `GET /api/projects` - проекты

### 2. Защищенные запросы (требуют JWT)
- `GET /api/wallet` - кошелек
- `POST /api/wallet/stake` - стейкинг
- `GET /api/user/profile` - профиль
- `POST /api/missions/:id/submit` - подача миссии
- `POST /api/social/share` - публикация в соцсетях
- `GET /api/referrals` - рефералы

## 🔧 Настройка на Vercel

### Serverless Functions

Vercel автоматически создает Serverless Functions для каждого API route:

```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30  // Максимальное время выполнения (секунды)
    }
  }
}
```

### Регионы

```json
// vercel.json
{
  "regions": ["iad1"]  // Вашингтон, США (близко к пользователям)
}
```

## 📝 Логирование

Все запросы логируются автоматически:
- В Vercel Dashboard → Functions → Logs
- В консоли при разработке (`npm run dev`)

## 🚀 Оптимизация

### Кэширование

Некоторые запросы можно кэшировать:

```typescript
// Пример кэширования
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
```

### Rate Limiting

Можно добавить rate limiting через middleware (в будущем).

## 📚 Дополнительная информация

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
