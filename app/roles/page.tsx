'use client';

import Link from 'next/link';
import { Users, Target, Shield, TrendingUp, BookOpen, Cpu, Building2, Landmark } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const roles = [
  {
    slug: 'activist',
    title: 'Ранний пользователь / активист',
    icon: Users,
    goals: ['миссии и участие', 'аирдропы и рефералы', 'социальные инициативы'],
    requirements: ['быстрый онбординг', 'прогресс и награды', 'простые публикации'],
  },
  {
    slug: 'researcher',
    title: 'Исследователь / учёный / студент',
    icon: BookOpen,
    goals: ['публикации', 'верификация', 'доступ к датасетам'],
    requirements: ['peer‑review', 'репозиторий данных', 'бонусы за качество'],
  },
  {
    slug: 'engineer',
    title: 'Инженер / инноватор',
    icon: Cpu,
    goals: ['пилоты сенсоров', 'прототипы', 'стандарты'],
    requirements: ['тех‑спеки', 'статусы пилотов', 'телеметрия'],
  },
  {
    slug: 'investor',
    title: 'Инвестор / криптоинвестор / фонд',
    icon: TrendingUp,
    goals: ['проекты', 'IRR и риски', 'прозрачность'],
    requirements: ['TokenHub', 'KPI/отчёты', 'комплаенс‑документы'],
  },
  {
    slug: 'company',
    title: 'Компании / корпорации',
    icon: Building2,
    goals: ['ESG‑отчётность', 'корпоративные проекты'],
    requirements: ['кабинет ESG', 'аудит', 'региональные KPI'],
  },
  {
    slug: 'ngo',
    title: 'НКО / международные организации',
    icon: Shield,
    goals: ['программы и аудит', 'SDG‑метрики'],
    requirements: ['макро‑дашборды', 'открытые отчёты'],
  },
  {
    slug: 'government',
    title: 'Государства / регуляторы',
    icon: Landmark,
    goals: ['контроль инфраструктуры', 'национальные KPI'],
    requirements: ['кризис‑панель', 'регуляторный контур'],
  },
];

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Target className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Роли и требования</h1>
          <p className="text-slate-400 max-w-3xl mx-auto">
            Каждый участник получает свой UX‑контур, инструменты и требования. Это база для DAO‑соцсети и экосистемы воды.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div key={index} className="glass-card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-glow/15 border border-cyan-glow/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-glow" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{role.title}</h2>
                </div>
                <div className="grid gap-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Цели</div>
                    <ul className="text-slate-300 text-sm list-disc list-inside space-y-1">
                      {role.goals.map((goal, i) => (
                        <li key={i}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Мини‑требования</div>
                    <ul className="text-slate-300 text-sm list-disc list-inside space-y-1">
                      {role.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href={`/roles/${role.slug}`}
                    onClick={() => trackEvent('role_card_open', { role: role.slug })}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-cyan-glow text-white font-semibold"
                  >
                    Перейти к сценарию
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
