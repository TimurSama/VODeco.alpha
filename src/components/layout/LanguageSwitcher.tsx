'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2.5 neo-button rounded-xl active:scale-95 transition-all flex items-center gap-2"
      aria-label="Switch language"
    >
      <Globe className="w-5 h-5 text-cyan-glow" />
      <span className="text-sm font-bold text-cyan-glow hidden sm:inline uppercase">
        {language}
      </span>
    </button>
  );
}
