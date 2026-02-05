'use client';

import { useEffect, useState } from 'react';
import { Copy, Users, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

type ReferralStats = {
  total: number;
  active: number;
  used: number;
  totalRewards: string;
  referrals: Array<{
    id: string;
    code: string;
    status: string;
    rewardAmount: string;
    createdAt: string;
    usedAt?: string | null;
    referred?: {
      username?: string;
      firstName?: string | null;
      lastName?: string | null;
    } | null;
  }>;
};

export default function ReferralsPage() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [link, setLink] = useState('');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/referrals');
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load referral code');
        setCode(data.code);
        setLink(data.link);
        const statsRes = await fetch('/api/referrals/stats');
        const statsData = await statsRes.json();
        if (!statsRes.ok) throw new Error(statsData?.error || 'Failed to load stats');
        setStats(statsData);
        trackEvent('referrals_view');
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      trackEvent('referrals_copy', { type: label });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <h1 className="text-3xl font-black text-white mb-2">Реферальная программа</h1>
          <p className="text-slate-400 text-sm">
            Делись ссылкой, привлекай пользователей и получай VOD credits.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-slate-400">Загрузка…</div>
        ) : error ? (
          <div className="text-rose-300">{error}</div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase">
                  <Users className="w-4 h-4" />
                  Всего
                </div>
                <div className="text-2xl font-black text-white">{stats?.total ?? 0}</div>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase">
                  <Gift className="w-4 h-4" />
                  Использовано
                </div>
                <div className="text-2xl font-black text-white">{stats?.used ?? 0}</div>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase">
                  <Gift className="w-4 h-4" />
                  Награды
                </div>
                <div className="text-2xl font-black text-white">
                  {parseFloat(stats?.totalRewards || '0').toLocaleString()} VOD
                </div>
              </div>
            </div>

            <div className="glass-card p-6 mb-6 space-y-4">
              <div>
                <div className="text-xs text-slate-400 uppercase mb-2">Код</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 glass rounded-lg text-white">{code}</div>
                  <button
                    onClick={() => copy(code, 'code')}
                    className="px-3 py-2 bg-white/10 rounded-lg text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase mb-2">Ссылка</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 glass rounded-lg text-white break-all">
                    {link}
                  </div>
                  <button
                    onClick={() => copy(link, 'link')}
                    className="px-3 py-2 bg-white/10 rounded-lg text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="text-sm text-slate-400 mb-4">История приглашений</div>
              <div className="space-y-3">
                {(stats?.referrals || []).map((ref) => (
                  <div key={ref.id} className="glass p-3 rounded-lg text-sm text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{ref.code}</span>
                      <span className="text-xs text-slate-400">{ref.status}</span>
                    </div>
                    {ref.referred && (
                      <div className="text-xs text-slate-400 mt-1">
                        Пользователь: {ref.referred.firstName || ref.referred.lastName
                          ? `${ref.referred.firstName || ''} ${ref.referred.lastName || ''}`.trim()
                          : ref.referred.username}
                      </div>
                    )}
                  </div>
                ))}
                {(stats?.referrals || []).length === 0 && (
                  <div className="text-slate-500 text-sm">Пока нет приглашений.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

