'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h1 className="text-3xl font-black text-white mb-4">Terms of Use</h1>
          <div className="text-sm text-slate-400 space-y-3">
            <p>Используя платформу VODeco, вы соглашаетесь с условиями.</p>
            <p>Платформа предоставляется «как есть», без гарантий доступности и точности данных.</p>
            <p>Все пользовательские публикации остаются ответственностью их авторов.</p>
            <p>Мы можем обновлять условия без предварительного уведомления.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

