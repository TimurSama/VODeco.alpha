'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Target, Gift, Share2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function CommunityPage() {
  const withUtm = (href: string, campaign: string) =>
    `${href}?utm_source=landing&utm_medium=cta&utm_campaign=${campaign}`;

  useEffect(() => {
    trackEvent('landing_community_view');
  }, []);

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-cyan-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Сообщество</h1>
              <p className="text-slate-400 text-sm">
                Миссии, награды, публикации и рост сообщества.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5">
            <Target className="w-5 h-5 text-emerald-glow mb-2" />
            <div className="text-white font-bold mb-1">Миссии</div>
            <p className="text-sm text-slate-400">
              Выполняйте задачи, получайте XP и награды.
            </p>
          </div>
          <div className="glass-card p-5">
            <Gift className="w-5 h-5 text-gold-glow mb-2" />
            <div className="text-white font-bold mb-1">Airdrop</div>
            <p className="text-sm text-slate-400">
              Участвуйте в программах и получайте VOD credits.
            </p>
          </div>
          <div className="glass-card p-5">
            <Share2 className="w-5 h-5 text-cyan-glow mb-2" />
            <div className="text-white font-bold mb-1">Social Share</div>
            <p className="text-sm text-slate-400">
              Делитесь новостями и результатами исследований.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Доступных миссий', value: '12+' },
            { label: 'Реферальные уровни', value: '3' },
            { label: 'Награды VOD', value: 'до 5%' },
            { label: 'Соц‑активности', value: '4' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-4 text-center">
              <div className="text-xs text-slate-400 uppercase mb-1">{item.label}</div>
              <div className="text-2xl font-black text-white">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="text-sm text-slate-400 mb-4">Сценарии участия</div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Новостной вклад', desc: 'Публикации и social share.' },
              { title: 'Исследовательские миссии', desc: 'Верификация и качество данных.' },
              { title: 'Социальный рост', desc: 'Рефералы и кампании.' },
            ].map((item) => (
              <div key={item.title} className="glass p-4 rounded-lg">
                <div className="text-white font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-wrap gap-3">
          <Link
            href={withUtm('/missions', 'community_missions')}
            onClick={() => trackEvent('community_cta', { action: 'missions' })}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold"
          >
            Открыть миссии
          </Link>
          <Link
            href={withUtm('/airdrop', 'community_airdrop')}
            onClick={() => trackEvent('community_cta', { action: 'airdrop' })}
            className="px-4 py-2 rounded-lg bg-gold-glow text-white font-semibold"
          >
            Airdrop программы
          </Link>
          <Link
            href={withUtm('/referrals', 'community_referrals')}
            onClick={() => trackEvent('community_cta', { action: 'referrals' })}
            className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold"
          >
            Рефералы
          </Link>
          <Link
            href={withUtm('/social-share', 'community_social_share')}
            onClick={() => trackEvent('community_cta', { action: 'social_share' })}
            className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold"
          >
            Social Share
          </Link>
        </div>
      </div>
    </div>
  );
}

