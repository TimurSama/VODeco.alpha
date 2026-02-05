'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Banknote, TrendingUp, ShieldCheck, BarChart3 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function ForInvestorsPage() {
  const withUtm = (href: string) =>
    `${href}?utm_source=landing&utm_medium=cta&utm_campaign=investors`;

  useEffect(() => {
    trackEvent('landing_investors_view');
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
            <div className="w-12 h-12 rounded-xl bg-gold-glow/20 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-gold-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Для инвесторов</h1>
              <p className="text-slate-400 text-sm">
                Экосистема воды с прозрачной моделью, метриками и долгосрочным циклом.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5">
            <TrendingUp className="w-5 h-5 text-cyan-glow mb-2" />
            <div className="text-white font-bold mb-1">Проектная экономика</div>
            <p className="text-sm text-slate-400">
              Стейкинг, отчётность по проектам, KPI и прозрачные потоки.
            </p>
          </div>
          <div className="glass-card p-5">
            <ShieldCheck className="w-5 h-5 text-emerald-glow mb-2" />
            <div className="text-white font-bold mb-1">Управление риском</div>
            <p className="text-sm text-slate-400">
              Роли, модерация, юридические дисклеймеры и контроль данных.
            </p>
          </div>
          <div className="glass-card p-5">
            <BarChart3 className="w-5 h-5 text-purple-glow mb-2" />
            <div className="text-white font-bold mb-1">Метрики и рост</div>
            <p className="text-sm text-slate-400">
              Воронки роста, миссии, рефералы и привлечение комьюнити.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Проекты в MVP', value: '3+' },
            { label: 'Источники данных', value: '3' },
            { label: 'Роли пользователей', value: '7' },
            { label: 'Сценарии роста', value: '4' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-4 text-center">
              <div className="text-xs text-slate-400 uppercase mb-1">{item.label}</div>
              <div className="text-2xl font-black text-white">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="text-sm text-slate-400 mb-4">Примеры инвестиционных кейсов</div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Пилот IoT‑сенсоров', desc: 'Прототипирование и стандартизация данных.' },
              { title: 'Инфраструктура мониторинга', desc: 'Станции контроля и открытые KPI.' },
              { title: 'Образовательные программы', desc: 'Рост вовлечения и контент‑экосистемы.' },
            ].map((item) => (
              <div key={item.title} className="glass p-4 rounded-lg">
                <div className="text-white font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-slate-400 mb-3">{item.desc}</div>
                <Link
                  href={withUtm('/projects')}
                  onClick={() => trackEvent('landing_investor_case_click', { title: item.title })}
                  className="text-xs text-cyan-glow"
                >
                  Смотреть проекты
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-white font-bold">Готовы к диалогу?</div>
            <div className="text-sm text-slate-400">
              Заполните форму — пришлём материалы и назначим созвон.
            </div>
          </div>
          <Link
            href={withUtm('/investors')}
            onClick={() => trackEvent('landing_investor_cta')}
            className="px-4 py-2 bg-gold-glow text-white rounded-lg font-semibold"
          >
            Оставить заявку
          </Link>
        </div>
      </div>
    </div>
  );
}

