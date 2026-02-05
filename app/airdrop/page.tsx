'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Target, Users } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function AirdropPage() {
  useEffect(() => {
    trackEvent('airdrop_view');
  }, []);

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-cyan-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Airdrop программы</h1>
              <p className="text-slate-400 text-sm">
                Получайте VOD credits за вклад в экосистему и рост сообщества.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <Sparkles className="w-6 h-6 text-emerald-glow mb-3" />
            <h3 className="text-white font-bold mb-1">Социальные аирдропы</h3>
            <p className="text-sm text-slate-400 mb-3">
              Делитесь новостями и результатами исследований.
            </p>
            <Link
              href="/social-share"
              onClick={() => trackEvent('airdrop_cta', { type: 'social' })}
              className="px-3 py-2 bg-white/10 rounded-lg text-sm text-white inline-flex"
            >
              Подать заявку
            </Link>
          </div>
          <div className="glass-card p-5">
            <Users className="w-6 h-6 text-gold-glow mb-3" />
            <h3 className="text-white font-bold mb-1">Реферальные награды</h3>
            <p className="text-sm text-slate-400 mb-3">
              Приглашайте участников в экосистему.
            </p>
            <Link
              href="/referrals"
              onClick={() => trackEvent('airdrop_cta', { type: 'referral' })}
              className="px-3 py-2 bg-white/10 rounded-lg text-sm text-white inline-flex"
            >
              Перейти к рефералам
            </Link>
          </div>
          <div className="glass-card p-5">
            <Target className="w-6 h-6 text-purple-glow mb-3" />
            <h3 className="text-white font-bold mb-1">Миссии и задачи</h3>
            <p className="text-sm text-slate-400 mb-3">
              Выполняйте миссии и получайте XP + награды.
            </p>
            <Link
              href="/missions"
              onClick={() => trackEvent('airdrop_cta', { type: 'missions' })}
              className="px-3 py-2 bg-white/10 rounded-lg text-sm text-white inline-flex"
            >
              Открыть миссии
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

