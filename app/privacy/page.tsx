'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h1 className="text-3xl font-black text-white mb-4">Privacy Policy</h1>
          <div className="text-sm text-slate-400 space-y-3">
            <p>Мы собираем минимальные данные для работы сервиса и аналитики.</p>
            <p>Персональные данные не продаются и не передаются третьим лицам без основания.</p>
            <p>Вы можете запросить удаление аккаунта и данных через поддержку.</p>
            <p>Политика может обновляться по мере развития продукта.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

