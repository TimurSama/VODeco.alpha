'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import InfoPopup from './InfoPopup';
import {
  Calendar,
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  Factory,
  Handshake,
  ArrowRight,
} from 'lucide-react';

interface OverviewScreen5Props {
  onNext: () => void;
  onPrev: () => void;
}

interface Phase {
  id: string;
  title: string;
  period: string;
  modules: string[];
  pages: string[];
  functions: string[];
}

interface Role {
  id: string;
  name: string;
  icon: typeof Users;
  features: string[];
}

const phases: Phase[] = [
  {
    id: 'phase1',
    title: 'Foundation',
    period: '0-6 месяцев',
    modules: ['Базовая инфраструктура', 'Пользовательские кабинеты', 'API интеграции'],
    pages: ['Dashboard', 'Profile', 'Projects'],
    functions: ['Регистрация', 'Базовый стейкинг', 'Проекты TokenHub'],
  },
  {
    id: 'phase2',
    title: 'Core Features',
    period: '6-18 месяцев',
    modules: ['IoT интеграция', 'DAO governance', 'Digital Twins'],
    pages: ['Data Lab', 'Governance', 'Library'],
    functions: ['Верификация данных', 'Голосование', 'Публикации исследований'],
  },
  {
    id: 'phase3',
    title: 'Advanced',
    period: '18-36 месяцев',
    modules: ['AI Analytics', 'Полная экосистема', 'Международная экспансия'],
    pages: ['Advanced Analytics', 'International Hub'],
    functions: ['Предиктивная аналитика', 'Глобальная интеграция'],
  },
];

const roles: Role[] = [
  {
    id: 'society',
    name: 'Общество',
    icon: Users,
    features: [
      'Гражданский мониторинг',
      'Образовательные программы',
      'Геймификация',
      'Социальные сети',
    ],
  },
  {
    id: 'researchers',
    name: 'Исследователи',
    icon: GraduationCap,
    features: [
      'Open Data API',
      'Публикации исследований',
      'Гранты и финансирование',
      'Peer-review система',
    ],
  },
  {
    id: 'governments',
    name: 'Государства',
    icon: Building2,
    features: [
      'Кризисные панели',
      'Регуляторные KPI',
      'Национальный мониторинг',
      'Интеграция с гос. системами',
    ],
  },
  {
    id: 'investors',
    name: 'Инвесторы',
    icon: TrendingUp,
    features: [
      'TokenHub проекты',
      'ESG метрики',
      'ROI аналитика',
      'Прозрачная отчетность',
    ],
  },
  {
    id: 'business',
    name: 'Бизнес',
    icon: Factory,
    features: [
      'Корпоративные кабинеты',
      'ESG репортинг',
      'Устойчивость',
      'CSR программы',
    ],
  },
  {
    id: 'partners',
    name: 'Партнеры',
    icon: Handshake,
    features: [
      'Партнерские программы',
      'Интеграции',
      'Совместные проекты',
      'Техническая поддержка',
    ],
  },
];

export default function OverviewScreen5({ onNext, onPrev }: OverviewScreen5Props) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string | null>(null);

  const selectedPhaseData = phases.find((p) => p.id === selectedPhase);
  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ocean-deep">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-glow/10 via-transparent to-cyan-glow/10" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4 gradient-text">
            Путь развития
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Дорожная карта реализации проекта
          </p>
        </motion.div>

        {/* Role Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setFilterRole(null)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterRole === null
                ? 'neo-button text-cyan-glow'
                : 'glass text-white/70 hover:bg-white/10'
            }`}
          >
            Все роли
          </button>
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setFilterRole(role.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  filterRole === role.id
                    ? 'neo-button text-cyan-glow'
                    : 'glass text-white/70 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {role.name}
              </button>
            );
          })}
        </div>

        {/* Phases Timeline */}
        <div className="space-y-8 mb-12">
          {phases.map((phase, idx) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-all"
              onClick={() => setSelectedPhase(phase.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{phase.title}</h3>
                  <p className="text-cyan-glow font-semibold">{phase.period}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-cyan-glow" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white/60 mb-2">Модули</h4>
                  <ul className="space-y-1">
                    {phase.modules.slice(0, 3).map((module, i) => (
                      <li key={i} className="text-sm text-white/70">• {module}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/60 mb-2">Страницы</h4>
                  <ul className="space-y-1">
                    {phase.pages.map((page, i) => (
                      <li key={i} className="text-sm text-white/70">• {page}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/60 mb-2">Функции</h4>
                  <ul className="space-y-1">
                    {phase.functions.map((func, i) => (
                      <li key={i} className="text-sm text-white/70">• {func}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Roles Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Градация по ролям
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedRole(role.id)}
                  className="glass-card p-6 cursor-pointer hover:scale-105 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-glow/20 text-cyan-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-glow transition-colors">
                    {role.name}
                  </h4>
                  <ul className="space-y-2">
                    {role.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="text-sm text-white/70">• {feature}</li>
                    ))}
                  </ul>
                  <div className="mt-4 text-sm text-cyan-glow flex items-center gap-2">
                    <span>Подробнее</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onPrev}
            className="px-6 py-3 neo-button rounded-xl font-semibold text-white hover:scale-105 transition-all"
          >
            Назад
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 neo-button rounded-xl font-semibold text-white hover:scale-105 transition-all"
          >
            Далее
          </button>
        </div>
      </div>

      {/* Phase Popup */}
      {selectedPhaseData && (
        <InfoPopup
          isOpen={!!selectedPhase}
          onClose={() => setSelectedPhase(null)}
          title={`${selectedPhaseData.title} - ${selectedPhaseData.period}`}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Модули</h4>
              <ul className="space-y-2">
                {selectedPhaseData.modules.map((module, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/70">
                    <span className="text-cyan-glow mt-1">•</span>
                    <span>{module}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Страницы</h4>
              <ul className="space-y-2">
                {selectedPhaseData.pages.map((page, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/70">
                    <span className="text-cyan-glow mt-1">•</span>
                    <span>{page}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Функции</h4>
              <ul className="space-y-2">
                {selectedPhaseData.functions.map((func, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/70">
                    <span className="text-cyan-glow mt-1">•</span>
                    <span>{func}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </InfoPopup>
      )}

      {/* Role Popup */}
      {selectedRoleData && (
        <InfoPopup
          isOpen={!!selectedRole}
          onClose={() => setSelectedRole(null)}
          title={selectedRoleData.name}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-white/80 leading-relaxed">
              Функции и возможности платформы, специально разработанные для {selectedRoleData.name.toLowerCase()}.
            </p>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Возможности:</h4>
              <ul className="space-y-2">
                {selectedRoleData.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/70">
                    <span className="text-cyan-glow mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </InfoPopup>
      )}
    </div>
  );
}
