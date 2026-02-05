'use client';

import { motion } from 'framer-motion';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h1 className="text-3xl font-black text-white mb-4">Disclaimer</h1>
          <div className="text-sm text-slate-400 space-y-3">
            <p>VODeco — MVP‑платформа. Часть данных является демо‑режимом.</p>
            <p>Информация не является финансовой рекомендацией или обещанием доходности.</p>
            <p>WTR‑эмиссия возможна только после подтверждения IoT‑данных.</p>
            <p>При принятии решений ориентируйтесь на официальные документы проекта.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

