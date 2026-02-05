'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

const roleData = [
  {
    slug: 'activist',
    title: 'Ранний пользователь / активист',
    focus: 'Миссии, аирдропы, социальная активность и рост сообщества.',
    actions: [
      { label: 'Миссии', href: '/missions' },
      { label: 'Airdrop', href: '/airdrop' },
      { label: 'Рефералы', href: '/referrals' },
      { label: 'Лента', href: '/feed' },
    ],
  },
  {
    slug: 'researcher',
    title: 'Исследователь / учёный / студент',
    focus: 'Публикации, исследования, доступ к данным и peer‑review.',
    actions: [
      { label: 'Библиотека', href: '/library' },
      { label: 'Публикации', href: '/profile' },
      { label: 'Дашборд', href: '/dashboard' },
      { label: 'Social Share', href: '/social-share' },
    ],
  },
  {
    slug: 'engineer',
    title: 'Инженер / инноватор',
    focus: 'Пилоты сенсоров, прототипы и стандартизация IoT‑данных.',
    actions: [
      { label: 'Проекты', href: '/projects' },
      { label: 'Миссии', href: '/missions' },
      { label: 'Партнёрство', href: '/partners' },
      { label: 'Дашборд', href: '/dashboard' },
    ],
  },
  {
    slug: 'investor',
    title: 'Инвестор / фонд',
    focus: 'Проекты, отчётность, IRR и прозрачность инвестиционных потоков.',
    actions: [
      { label: 'Инвесторам', href: '/investors' },
      { label: 'Проекты', href: '/projects' },
      { label: 'Покупка VOD', href: '/token-sale' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    slug: 'company',
    title: 'Компании / корпорации',
    focus: 'ESG‑отчётность, корпоративные проекты и KPI по воде.',
    actions: [
      { label: 'Партнёрство', href: '/partners' },
      { label: 'Проекты', href: '/projects' },
      { label: 'Дашборд', href: '/dashboard' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    slug: 'ngo',
    title: 'НКО / международные организации',
    focus: 'Программы, аудит и SDG‑метрики.',
    actions: [
      { label: 'Партнёрство', href: '/partners' },
      { label: 'Дашборд', href: '/dashboard' },
      { label: 'Whitepaper', href: '/whitepaper' },
      { label: 'Новости', href: '/news' },
    ],
  },
  {
    slug: 'government',
    title: 'Государства / регуляторы',
    focus: 'Контроль инфраструктуры, национальные KPI и кризис‑контуры.',
    actions: [
      { label: 'Партнёрство', href: '/partners' },
      { label: 'Дашборд', href: '/dashboard' },
      { label: 'Whitepaper', href: '/whitepaper' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
];

export default function RoleDetailPage() {
  const params = useParams<{ slug: string }>();
  const role = useMemo(() => roleData.find((r) => r.slug === params.slug), [params.slug]);

  if (!role) {
    return (
      <div className="min-h-screen bg-ocean-deep flex items-center justify-center text-slate-400">
        Роль не найдена
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <h1 className="text-3xl font-black text-white mb-2">{role.title}</h1>
          <p className="text-slate-400 text-sm">{role.focus}</p>
        </motion.div>

        <div className="glass-card p-6">
          <div className="text-sm text-slate-400 mb-4">Основные действия</div>
          <div className="flex flex-wrap gap-3">
            {role.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                onClick={() => trackEvent('role_action_click', { role: role.slug, action: action.href })}
                className="px-4 py-2 rounded-lg bg-cyan-glow text-white font-semibold"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

