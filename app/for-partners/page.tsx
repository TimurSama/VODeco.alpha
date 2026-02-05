'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Handshake, Globe, Cpu, BookOpen } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function ForPartnersPage() {
  const withUtm = (href: string) =>
    `${href}?utm_source=landing&utm_medium=cta&utm_campaign=partners`;

  useEffect(() => {
    trackEvent('landing_partners_view');
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
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Handshake className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Для партнёров</h1>
              <p className="text-slate-400 text-sm">
                НКО, компании, госструктуры и лаборатории — объединяем усилия для воды.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-5">
            <Globe className="w-5 h-5 text-cyan-glow mb-2" />
            <div className="text-white font-bold mb-1">Глобальные программы</div>
            <p className="text-sm text-slate-400">
              SDG‑контуры, открытые отчёты и совместные KPI.
            </p>
          </div>
          <div className="glass-card p-5">
            <Cpu className="w-5 h-5 text-purple-glow mb-2" />
            <div className="text-white font-bold mb-1">Инфраструктура и IoT</div>
            <p className="text-sm text-slate-400">
              Пилоты сенсоров, протоколы верификации и стандартизация.
            </p>
          </div>
          <div className="glass-card p-5">
            <BookOpen className="w-5 h-5 text-emerald-glow mb-2" />
            <div className="text-white font-bold mb-1">Исследования и данные</div>
            <p className="text-sm text-slate-400">
              Доступ к датасетам и совместные публикации.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Партнёрских сценариев', value: '5' },
            { label: 'Источники данных', value: '3' },
            { label: 'Программы SDG', value: '6+' },
            { label: 'Гео‑охват', value: 'Global' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-4 text-center">
              <div className="text-xs text-slate-400 uppercase mb-1">{item.label}</div>
              <div className="text-2xl font-black text-white">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="text-sm text-slate-400 mb-4">Примеры партнёрских кейсов</div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'НКО‑кампании', desc: 'Совместные программы и публичные отчёты.' },
              { title: 'Пилоты на регионах', desc: 'Инфраструктура и мониторинг качества.' },
              { title: 'Образовательные циклы', desc: 'Контент и вовлечение сообществ.' },
            ].map((item) => (
              <div key={item.title} className="glass p-4 rounded-lg">
                <div className="text-white font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-slate-400 mb-3">{item.desc}</div>
                <Link
                  href={withUtm('/partners')}
                  onClick={() => trackEvent('landing_partner_case_click', { title: item.title })}
                  className="text-xs text-cyan-glow"
                >
                  Обсудить партнёрство
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-white font-bold">Готовы к партнёрству?</div>
            <div className="text-sm text-slate-400">
              Опишите формат сотрудничества — мы свяжемся.
            </div>
          </div>
          <Link
            href={withUtm('/partners')}
            onClick={() => trackEvent('landing_partner_cta')}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold"
          >
            Оставить заявку
          </Link>
        </div>
      </div>
    </div>
  );
}

