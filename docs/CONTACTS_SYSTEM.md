# Система контактов для VODeco

## 📋 Где вести контакты?

### Вариант 1: База данных (Рекомендуется)

Создайте модель `Contact` в Prisma для хранения контактов пользователей, организаций, партнеров.

### Вариант 2: Внешний сервис

Используйте CRM системы (HubSpot, Salesforce) или специализированные сервисы.

## 🗄️ Реализация в базе данных

### Модель Contact

Добавьте в `prisma/schema.prisma`:

```prisma
model Contact {
  id            String   @id @default(cuid())
  type          String   // 'user', 'organization', 'partner', 'company', 'influencer'
  name          String
  email         String?
  phone         String?
  telegram      String?
  website       String?
  description   String?
  category      String?  // 'developer', 'designer', 'marketer', 'investor', etc.
  status        String   @default("active") // 'active', 'inactive', 'archived'
  tags          String?  // JSON array
  notes         String?  // Дополнительные заметки
  metadata      String?  // JSON: дополнительные данные
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Связь с пользователем (если контакт - пользователь платформы)
  userId        String?
  user          User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  // Связь с миссиями (если контакт подал заявку)
  missionSubmissions MissionSubmission[]
  
  @@index([type])
  @@index([status])
  @@index([category])
  @@index([userId])
}

// Добавить в модель User:
// contacts Contact[]
```

### API для контактов

Создайте `app/api/contacts/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth, optionalAuth } from '@/lib/auth/middleware';

// GET /api/contacts - список контактов
export async function GET(request: NextRequest) {
  const authResult = await optionalAuth(request);
  // ... реализация
}

// POST /api/contacts - создать контакт
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  // ... реализация
}
```

## 📱 Интеграция с Telegram

### Хранение контактов из Telegram

При регистрации через Telegram автоматически сохраняются:
- `telegramId`
- `telegramUsername`
- `firstName`, `lastName`
- `avatar`

Эти данные уже есть в модели `User`.

### Telegram Mini App контакты

Можно использовать Telegram Contacts API:

```typescript
// В Telegram Mini App
const contacts = window.Telegram.WebApp.initDataUnsafe?.user?.contacts;
```

## 🔗 Интеграция с внешними сервисами

### 1. HubSpot CRM

```typescript
// app/api/contacts/sync/hubspot/route.ts
export async function POST(request: NextRequest) {
  // Синхронизация контактов с HubSpot
}
```

### 2. Google Contacts

```typescript
// Интеграция через Google Contacts API
```

## 📊 Использование контактов

### 1. Реферальная система

Контакты используются для отслеживания рефералов:
- Кто пригласил
- Кто был приглашен
- Статистика

### 2. Миссии и вакансии

Контакты связаны с заявками на миссии:
- Кто подал заявку
- Контактная информация
- История взаимодействий

### 3. Партнерства

Контакты организаций и компаний:
- Партнеры
- Инвесторы
- Организации

## 🎯 Рекомендации

### Для MVP (сейчас):

1. **Используйте модель User** для базовых контактов
2. **Добавьте модель Contact** для расширенных контактов (организации, партнеры)
3. **Создайте простой API** для управления контактами

### Для продакшена (позже):

1. **Интеграция с CRM** (HubSpot, Salesforce)
2. **Email маркетинг** (Mailchimp, SendGrid)
3. **Автоматизация** (Zapier, Make)

## 📝 Пример использования

```typescript
// Создание контакта
const contact = await prisma.contact.create({
  data: {
    type: 'organization',
    name: 'Water Foundation',
    email: 'contact@waterfoundation.org',
    website: 'https://waterfoundation.org',
    category: 'partner',
    description: 'Non-profit organization focused on water resources',
  },
});

// Поиск контактов
const contacts = await prisma.contact.findMany({
  where: {
    type: 'organization',
    category: 'partner',
    status: 'active',
  },
});
```
