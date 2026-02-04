/**
 * Telegram Mini App Integration
 * Handles initialization and UI setup for Telegram WebApp
 */

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
          auth_date: number;
          hash: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        CloudStorage: {
          setItem: (key: string, value: string, callback?: (error: Error | null, success: boolean) => void) => void;
          getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => void;
          getItems: (keys: string[], callback: (error: Error | null, values: Record<string, string>) => void) => void;
          removeItem: (key: string, callback?: (error: Error | null, success: boolean) => void) => void;
          removeItems: (keys: string[], callback?: (error: Error | null, success: boolean) => void) => void;
          getKeys: (callback: (error: Error | null, keys: string[]) => void) => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        sendData: (data: string) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (id: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: {
          text?: string;
        }, callback?: (data: string) => void) => void;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback?: (text: string) => void) => void;
        requestWriteAccess: (callback?: (granted: boolean) => void) => void;
        requestContact: (callback?: (granted: boolean) => void) => void;
        onEvent: (eventType: string, eventHandler: (...args: any[]) => void) => void;
        offEvent: (eventType: string, eventHandler: (...args: any[]) => void) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        enableVerticalSwipes: () => void;
        disableVerticalSwipes: () => void;
      };
    };
  }
}

export interface TelegramData {
  isTelegram: boolean;
  webApp: Window['Telegram']['WebApp'] | null;
  user: Window['Telegram']['WebApp']['initDataUnsafe']['user'] | null;
}

/**
 * Initialize Telegram WebApp
 */
export function initTelegram(): TelegramData {
  if (typeof window === 'undefined') {
    return { isTelegram: false, webApp: null, user: null };
  }

  const telegram = window.Telegram?.WebApp;
  if (!telegram) {
    return { isTelegram: false, webApp: null, user: null };
  }

  telegram.ready();
  telegram.expand();

  const user = telegram.initDataUnsafe?.user || null;

  return {
    isTelegram: true,
    webApp: telegram,
    user,
  };
}

/**
 * Setup Telegram UI theme
 */
export function setupTelegramUI() {
  if (typeof window === 'undefined') return;

  const telegram = window.Telegram?.WebApp;
  if (!telegram) return;

  // Apply Telegram theme colors
  const theme = telegram.themeParams;
  if (theme.bg_color) {
    document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color);
  }
  if (theme.text_color) {
    document.documentElement.style.setProperty('--tg-text-color', theme.text_color);
  }
  if (theme.button_color) {
    document.documentElement.style.setProperty('--tg-button-color', theme.button_color);
  }
  if (theme.button_text_color) {
    document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color);
  }

  // Handle viewport height
  const setViewportHeight = () => {
    const vh = telegram.viewportHeight;
    document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);
  };

  setViewportHeight();
  telegram.onEvent('viewportChanged', setViewportHeight);
}

/**
 * Check if running in Telegram context
 */
export function isTelegramContext(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.Telegram?.WebApp;
}

/**
 * Get Telegram user data
 */
export function getTelegramUser() {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
}

/**
 * Send data to bot
 */
export function sendDataToBot(data: any) {
  if (typeof window === 'undefined') return;
  const telegram = window.Telegram?.WebApp;
  if (!telegram) return;
  telegram.sendData(JSON.stringify(data));
}

/**
 * Haptic feedback
 */
export const haptic = {
  impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    if (typeof window === 'undefined') return;
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
  },
  notification: (type: 'error' | 'success' | 'warning' = 'success') => {
    if (typeof window === 'undefined') return;
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
  },
  selection: () => {
    if (typeof window === 'undefined') return;
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
  },
};
