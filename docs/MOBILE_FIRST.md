# Мобильная ориентация VODeco MVP

## 📱 Mobile-First подход

VODeco MVP разработан с **приоритетом на мобильные устройства** с адаптацией под десктоп.

---

## ✅ Реализовано

### 1. Viewport и мета-теги ✅
- ✅ Правильный viewport в `app/layout.tsx`
- ✅ `viewport-fit: cover` для Telegram Mini App
- ✅ `theme-color` для мобильных браузеров
- ✅ Apple Web App мета-теги

### 2. CSS адаптивность ✅
- ✅ **Mobile-first подход** в `app/globals.css`
- ✅ Медиа-запросы: `@media (max-width: 640px)` для мобильных
- ✅ Адаптивные утилиты Tailwind: `sm:`, `md:`, `lg:`, `xl:`
- ✅ Touch-оптимизации: отключение hover на touch-устройствах

### 3. Компоненты ✅
- ✅ **Header**: адаптивный, бургер-меню для мобильных
- ✅ **Sidebar**: swipe-жесты для открытия/закрытия (как в Telegram)
- ✅ **Touch-жесты**: свайп слева для открытия меню
- ✅ **Telegram Mini App**: специальные стили для `tg-viewport`

### 4. UX для мобильных ✅
- ✅ Большие touch-таргеты (кнопки, ссылки)
- ✅ Оптимизация для вертикальной ориентации
- ✅ Адаптивные отступы и размеры шрифтов
- ✅ Оптимизация скролла

---

## 📐 Breakpoints

Приложение использует стандартные Tailwind breakpoints:

```css
/* Mobile First */
- Базовые стили: для мобильных (< 640px)
- sm: 640px+ (планшеты)
- md: 768px+ (планшеты landscape)
- lg: 1024px+ (ноутбуки)
- xl: 1280px+ (десктопы)
```

---

## 🎯 Особенности мобильной версии

### 1. Telegram Mini App оптимизация
- ✅ Специальные стили для Telegram WebView
- ✅ Поддержка `viewport-fit: cover` для полноэкранного режима
- ✅ Интеграция с Telegram SDK (`@twa-dev/sdk`)

### 2. Touch-жесты
- ✅ **Swipe слева** → открывает меню (как в Telegram)
- ✅ **Swipe справа** → закрывает меню
- ✅ Отключение hover-эффектов на touch-устройствах

### 3. Адаптивная навигация
- ✅ Бургер-меню вместо полного меню на мобильных
- ✅ Sidebar с overlay на мобильных
- ✅ Полноэкранный sidebar на маленьких экранах

### 4. Оптимизация контента
- ✅ Адаптивные карточки (меньше padding на мобильных)
- ✅ Адаптивные шрифты
- ✅ Оптимизация изображений
- ✅ Lazy loading для тяжёлых компонентов

---

## 🔧 Технические детали

### Viewport конфигурация

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover', // Для Telegram Mini App
  },
  themeColor: '#020617',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};
```

### CSS медиа-запросы

```css
/* Mobile First - базовые стили для мобильных */
.glass-card {
  padding: 1rem;
}

/* Планшеты и выше */
@media (min-width: 768px) {
  .glass-card {
    padding: 1.5rem;
  }
}

/* Touch-устройства */
@media (hover: none) and (pointer: coarse) {
  .glass-card:hover {
    transform: none; /* Отключаем hover */
  }
}
```

### Touch-жесты в Header

```typescript
// src/components/layout/Header.tsx
// Swipe from left edge to open menu (like Telegram)
useEffect(() => {
  const handleTouchEnd = (e: TouchEvent) => {
    // Swipe from left edge (within 20px) to right opens menu
    if (touchStartX < 20 && deltaX > 50) {
      setSidebarOpen(true);
    }
  };
}, []);
```

---

## 📱 Тестирование

### Рекомендуемые устройства для тестирования:

1. **Мобильные (приоритет):**
   - iPhone 12/13/14 (375px × 812px)
   - iPhone SE (375px × 667px)
   - Android (360px × 640px)

2. **Планшеты:**
   - iPad (768px × 1024px)
   - iPad Pro (1024px × 1366px)

3. **Десктоп (адаптация):**
   - 1280px+ (стандартный десктоп)
   - 1920px+ (большие мониторы)

### Chrome DevTools:
- Используйте Device Toolbar (F12 → Toggle device toolbar)
- Тестируйте на разных размерах экранов
- Проверяйте touch-жесты

---

## 🚀 Рекомендации

### Для улучшения мобильного UX:

1. ✅ **Уже реализовано:** Mobile-first подход, touch-жесты, адаптивные компоненты
2. ⚠️ **Можно улучшить:**
   - Добавить PWA манифест для установки как приложение
   - Оптимизировать изображения (next/image с lazy loading)
   - Добавить skeleton loaders для лучшего UX загрузки

---

## 📊 Статус

**Мобильная ориентация: ✅ ГОТОВО**

- ✅ Viewport настроен
- ✅ Mobile-first CSS
- ✅ Touch-жесты реализованы
- ✅ Telegram Mini App оптимизация
- ✅ Адаптивные компоненты
- ✅ Десктоп адаптация работает

**Приложение готово для использования на мобильных устройствах!**
