'use client';

import { useEffect, useState, ReactNode } from 'react';
import { initTelegram, setupTelegramUI } from '@/lib/telegram/telegram';

interface TelegramProviderProps {
  children: ReactNode;
}

export default function TelegramProvider({ children }: TelegramProviderProps) {
  const [isTelegram, setIsTelegram] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const telegramData = initTelegram();
    setIsTelegram(telegramData.isTelegram || false);

    if (telegramData.isTelegram) {
      setupTelegramUI();
    }

    setInitialized(true);
  }, []);

  // Add Telegram-specific styles
  useEffect(() => {
    if (isTelegram && typeof document !== 'undefined') {
      document.documentElement.classList.add('tg-viewport');
    }
  }, [isTelegram]);

  return <>{children}</>;
}
