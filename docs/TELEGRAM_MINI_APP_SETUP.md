# Настройка Telegram Mini App для VODeco

## 📱 Что такое Telegram Mini App?

Telegram Mini App - это веб-приложение, которое запускается внутри Telegram и имеет доступ к API Telegram для аутентификации, платежей и других функций.

## ✅ Текущая реализация

В проекте уже есть:
- ✅ `TelegramProvider` компонент (`src/components/shared/TelegramProvider.tsx`)
- ✅ Telegram auth API (`app/api/auth/telegram/route.ts`)
- ✅ Telegram SDK (`@twa-dev/sdk` в зависимостях)
- ✅ Базовая интеграция в `app/layout.tsx`

## 🔧 Что нужно настроить

### 1. Создать Telegram Bot

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните **Bot Token** (добавьте в переменные окружения)

### 2. Настроить Mini App в BotFather

1. Отправьте `/newapp` в [@BotFather](https://t.me/BotFather)
2. Выберите вашего бота
3. Укажите название приложения: `VODeco`
4. Укажите описание: `Water Resource Management Platform`
5. Загрузите иконку (512x512px)
6. Укажите **Web App URL**: `https://your-project.vercel.app`
7. Укажите **Short Name**: `vodeco` (будет использоваться в ссылке)

### 3. Переменные окружения

Добавьте в Vercel (Environment Variables):

```env
TELEGRAM_BOT_TOKEN=ваш-токен-от-botfather
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### 4. Настройка домена для Telegram

Telegram требует HTTPS для Mini Apps. Vercel автоматически предоставляет HTTPS.

**Важно:** Убедитесь, что:
- ✅ Домен имеет валидный SSL сертификат (Vercel делает это автоматически)
- ✅ Приложение доступно по HTTPS
- ✅ CORS настроен правильно (Next.js делает это автоматически)

### 5. Обновить TelegramProvider (опционально)

Если нужно больше функций Telegram API, можно расширить:

```typescript
// src/lib/telegram/telegram.ts
import { initDataRaw, initData } from '@twa-dev/sdk';

export function initTelegram() {
  if (typeof window === 'undefined') {
    return { isTelegram: false };
  }

  // Проверка, что запущено в Telegram
  const isTelegram = window.Telegram?.WebApp !== undefined;
  
  if (isTelegram) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand(); // Развернуть на весь экран
    
    return {
      isTelegram: true,
      user: tg.initDataUnsafe?.user,
      initData: tg.initData,
    };
  }
  
  return { isTelegram: false };
}
```

## 🔗 Ссылка на Mini App

После настройки в BotFather, ссылка будет:
```
https://t.me/your_bot/vodeco
```

Или можно использовать:
```
https://t.me/your_bot?startapp=vodeco
```

## 📋 Чеклист настройки

- [ ] Создан бот через @BotFather
- [ ] Получен Bot Token
- [ ] Создано Mini App через @BotFather
- [ ] Указан Web App URL (ваш Vercel домен)
- [ ] TELEGRAM_BOT_TOKEN добавлен в переменные окружения Vercel
- [ ] NEXT_PUBLIC_APP_URL добавлен в переменные окружения Vercel
- [ ] Приложение задеплоено на Vercel
- [ ] Проверена работа аутентификации через Telegram

## 🎯 Дополнительные возможности Telegram Mini App

### Платежи (Telegram Payments)
```typescript
// В будущем можно добавить
window.Telegram.WebApp.openInvoice({
  url: 'https://your-payment-url'
});
```

### Кнопки внизу экрана
```typescript
window.Telegram.WebApp.MainButton.setText('Купить токены');
window.Telegram.WebApp.MainButton.onClick(() => {
  // Действие
});
```

### Уведомления
```typescript
window.Telegram.WebApp.showAlert('Привет!');
```

## 🔒 Безопасность

Важно проверять данные от Telegram на сервере:

```typescript
// app/api/auth/telegram/route.ts
// Уже реализовано - функция validateTelegramAuth
// Проверяет hash от Telegram для безопасности
```

## 📚 Документация

- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [TWA Dev SDK](https://github.com/twa-dev/sdk)
- [BotFather Guide](https://core.telegram.org/bots/tutorial)
