'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Droplets, Activity, DollarSign, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface Metric {
  label: string;
  value: string;
  change?: string;
  icon: typeof TrendingUp;
  color: string;
  glowColor: string;
}

interface MetricsPanelProps {
  metrics?: Metric[];
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  const { t } = useLanguage();
  
  const defaultMetrics: Metric[] = [
    {
      label: t('dashboard.globalMetrics'),
      value: '1,234',
      change: '+8%',
      icon: Droplets,
      color: 'text-cyan-glow',
      glowColor: 'shadow-cyan-glow/20',
    },
    {
      label: t('dashboard.ecologicalIndicators'),
      value: '72%',
      change: '+3%',
      icon: Activity,
      color: 'text-emerald-glow',
      glowColor: 'shadow-emerald-glow/20',
    },
    {
      label: t('dashboard.economicIndices'),
      value: '$2.5M',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-gold-glow',
      glowColor: 'shadow-gold-glow/20',
    },
    {
      label: t('dashboard.investmentMetrics'),
      value: '45',
      change: '+5%',
      icon: DollarSign,
      color: 'text-purple-glow',
      glowColor: 'shadow-purple-glow/20',
    },
  ];

  const displayMetrics = metrics || defaultMetrics;

  return (
    <div className="space-y-4">
      {displayMetrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="neo-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                  {metric.label}
                </p>
                <p className={`text-2xl font-black ${metric.color} mb-1`}>
                  {metric.value}
                </p>
                {metric.change && (
                  <p className="text-xs text-emerald-glow font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {metric.change}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-xl ${metric.glowColor} bg-white/5`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
