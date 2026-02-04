'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Wallet as WalletIcon, TrendingUp, History, CreditCard, Coins, RefreshCw, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function WalletPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'balance' | 'staking' | 'history'>('balance');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');
  const [walletData, setWalletData] = useState<{
    userId: string;
    balance: string;
    staked: string;
    available: string;
    transactions: Array<{
      id: string;
      type: string;
      amount: string;
      status: string;
      description?: string | null;
      createdAt: string;
    }>;
    stakings: Array<{
      id: string;
      amount: string;
      apy?: string | null;
      startDate: string;
      rewards: string;
      status: string;
      project: { name: string; slug: string };
    }>;
  } | null>(null);

  const loadWallet = async (useRefresh = false) => {
    if (useRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/wallet');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load wallet');
      setWalletData(data);
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' && e && 'message' in e && typeof (e as { message?: unknown }).message === 'string'
          ? (e as { message: string }).message
          : 'Failed to load wallet';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWallet(false);
  }, []);

  const wallet = useMemo(() => {
    return {
      balance: walletData?.balance || '0',
      staked: walletData?.staked || '0',
      available: walletData?.available || '0',
      activeStakings: walletData?.stakings?.length || 0,
    };
  }, [walletData]);

  const tabs = [
    { id: 'balance', label: t('wallet.tabs.balance'), icon: WalletIcon },
    { id: 'staking', label: t('wallet.tabs.staking'), icon: TrendingUp },
    { id: 'history', label: t('wallet.tabs.history'), icon: History },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-deep flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-4">
      <div className="container mx-auto max-w-6xl">
        {error && (
          <div className="neo-card p-4 mb-6 border border-rose-500/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-rose-300 font-bold">Ошибка</div>
                <div className="text-slate-300 text-sm">{error}</div>
              </div>
              <button
                onClick={() => loadWallet(true)}
                className="px-4 py-2 neo-button rounded-xl font-semibold flex items-center gap-2"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Повторить
              </button>
            </div>
          </div>
        )}

        {/* Balance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{t('wallet.title')}</h1>
              <p className="text-white/60">{t('wallet.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadWallet(true)}
                className="px-4 py-2 glass rounded-xl font-semibold hover:bg-white/5 transition-all flex items-center gap-2"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Обновить</span>
              </button>
              <Link href="/whitepaper#staking" className="px-4 py-2 neo-button rounded-xl font-semibold">
                Калькуляторы
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-white/60 mb-2">{t('wallet.totalBalance')}</p>
              <p className="text-3xl font-bold text-neon-cyan">{wallet.balance} VOD</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-white/60 mb-2">{t('wallet.staked')}</p>
              <p className="text-3xl font-bold text-neon-green">{wallet.staked} VOD</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-white/60 mb-2">{t('wallet.available')}</p>
              <p className="text-3xl font-bold text-neon-blue">{wallet.available} VOD</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-neon-cyan text-white'
                    : 'glass hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'balance' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card"
          >
            <h2 className="text-2xl font-bold mb-4">{t('wallet.quickActions')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button className="glass p-6 rounded-lg hover:bg-white/10 transition-colors text-left">
                <CreditCard className="w-8 h-8 text-neon-cyan mb-2" />
                <h3 className="font-semibold mb-1">{t('wallet.addCard')}</h3>
                <p className="text-sm text-white/60">{t('wallet.addCardDesc')}</p>
              </button>
              <button className="glass p-6 rounded-lg hover:bg-white/10 transition-colors text-left">
                <Coins className="w-8 h-8 text-neon-purple mb-2" />
                <h3 className="font-semibold mb-1">{t('wallet.connectWallet')}</h3>
                <p className="text-sm text-white/60">{t('wallet.connectWalletDesc')}</p>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'staking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {!walletData?.stakings?.length ? (
              <div className="glass-card">
                <div className="text-slate-300 font-semibold">Активных стейков пока нет</div>
                <div className="text-slate-400 text-sm mt-1">
                  Откройте проекты и застейкайте токены в выбранный проект.
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href="/projects" className="px-4 py-2 neo-button rounded-xl font-semibold">
                    Открыть проекты
                  </Link>
                  <Link href="/whitepaper#staking" className="px-4 py-2 glass rounded-xl font-semibold hover:bg-white/5 transition-all">
                    Как работает стейкинг
                  </Link>
                </div>
              </div>
            ) : (
              walletData.stakings.map((staking) => (
                <div key={staking.id} className="glass-card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{staking.project?.name || 'Project'}</h3>
                      <p className="text-sm text-white/60">
                        {t('wallet.staked')}: {staking.amount} VOD
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neon-green">{staking.apy ? `${staking.apy}%` : '—'}</p>
                      <p className="text-sm text-white/60">APY</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-sm text-white/60 mb-1">{t('wallet.startDate')}</p>
                      <p>{new Date(staking.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-1">{t('wallet.rewards')}</p>
                      <p className="text-neon-green font-semibold">+{staking.rewards} VOD</p>
                    </div>
                    <div className="flex items-end">
                      <Link
                        href={`/projects/${staking.project?.slug || ''}`}
                        className="w-full px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        {t('wallet.viewDetails')}
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card"
          >
            <h2 className="text-2xl font-bold mb-4">{t('wallet.transactionHistory')}</h2>
            <div className="space-y-3">
              {(walletData?.transactions || []).map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center p-4 glass rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{tx.description || tx.type}</p>
                    <p className="text-sm text-white/60">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        Number(tx.amount) >= 0
                          ? 'text-neon-green'
                          : 'text-red-400'
                      }`}
                    >
                      {Number(tx.amount) >= 0 ? '+' : ''}{tx.amount} VOD
                    </p>
                    <p className="text-sm text-white/60 capitalize">{tx.status}</p>
                  </div>
                </div>
              ))}
              {!walletData?.transactions?.length && (
                <div className="text-slate-400">История транзакций пока пустая.</div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
