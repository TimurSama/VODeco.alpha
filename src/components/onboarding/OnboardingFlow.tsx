'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  Cpu,
  TrendingUp,
  Building2,
  Shield,
  Landmark,
  CheckCircle,
  ArrowRight,
  Target,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  goals: string[];
  color: string;
}

const roles: Role[] = [
  {
    id: 'activist',
    title: 'Ранний пользователь / активист',
    description: 'Участвуйте в миссиях, получайте награды и помогайте экологии',
    icon: Users,
    goals: ['миссии и участие', 'аирдропы и рефералы', 'социальные инициативы'],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'researcher',
    title: 'Исследователь / учёный / студент',
    description: 'Публикуйте исследования, получайте верификацию и доступ к датасетам',
    icon: BookOpen,
    goals: ['публикации', 'верификация', 'доступ к датасетам'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'engineer',
    title: 'Инженер / инноватор',
    description: 'Разрабатывайте пилоты сенсоров, прототипы и стандарты',
    icon: Cpu,
    goals: ['пилоты сенсоров', 'прототипы', 'стандарты'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'investor',
    title: 'Инвестор / криптоинвестор / фонд',
    description: 'Инвестируйте в проекты, отслеживайте IRR и риски',
    icon: TrendingUp,
    goals: ['проекты', 'IRR и риски', 'прозрачность'],
    color: 'from-gold-glow to-yellow-500',
  },
  {
    id: 'company',
    title: 'Компании / корпорации',
    description: 'ESG-отчётность и корпоративные проекты',
    icon: Building2,
    goals: ['ESG‑отчётность', 'корпоративные проекты'],
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'ngo',
    title: 'НКО / международные организации',
    description: 'Программы, аудит и SDG-метрики',
    icon: Shield,
    goals: ['программы и аудит', 'SDG‑метрики'],
    color: 'from-rose-500 to-red-500',
  },
  {
    id: 'government',
    title: 'Государства / регуляторы',
    description: 'Контроль инфраструктуры и национальные KPI',
    icon: Landmark,
    goals: ['контроль инфраструктуры', 'национальные KPI'],
    color: 'from-slate-500 to-gray-500',
  },
];

interface OnboardingFlowProps {
  currentRole?: string;
  onComplete: (role: string) => Promise<void>;
  onSkip?: () => void;
}

const steps = [
  { id: 'welcome', title: 'Добро пожаловать' },
  { id: 'role', title: 'Выберите роль' },
  { id: 'complete', title: 'Готово' },
];

export default function OnboardingFlow({ currentRole, onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string>(currentRole || 'activist');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    trackEvent('onboarding_role_selected', { role: roleId });
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Complete onboarding
      setLoading(true);
      setError('');
      try {
        await onComplete(selectedRole);
        trackEvent('onboarding_completed', { role: selectedRole });
      } catch (err: any) {
        setError(err?.message || 'Ошибка при сохранении');
        setLoading(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      // Default: complete with current role
      onComplete(selectedRole);
    }
    trackEvent('onboarding_skipped', { role: selectedRole });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-ocean-deep/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Шаг {currentStep + 1} из {steps.length}
            </span>
            <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-ocean-mid rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-cyan-glow to-blue-500"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Добро пожаловать в VODeco!</h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Мы рады видеть вас в сообществе, которое работает над сохранением водных ресурсов планеты.
              </p>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Чтобы предоставить вам лучший опыт, выберите свою роль. Вы сможете изменить её позже в настройках профиля.
              </p>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-black text-white mb-2 text-center">Выберите свою роль</h2>
              <p className="text-slate-400 text-center mb-6">
                Каждая роль предоставляет уникальные возможности и инструменты
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <motion.button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-cyan-glow bg-cyan-glow/10'
                          : 'border-white/10 bg-ocean-mid/50 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-1">{role.title}</h3>
                          <p className="text-xs text-slate-400 mb-2">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.goals.slice(0, 2).map((goal, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 bg-white/5 rounded text-slate-300"
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-cyan-glow flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-black text-white mb-4">Готово!</h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Вы выбрали роль <span className="text-cyan-glow font-semibold">
                  {roles.find((r) => r.id === selectedRole)?.title}
                </span>
              </p>
              <p className="text-slate-400 mb-8">
                Теперь вы можете начать использовать все возможности платформы
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/10">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Назад
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Пропустить
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-glow to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 ml-auto"
          >
            {loading ? (
              'Сохранение...'
            ) : currentStep === steps.length - 1 ? (
              'Начать'
            ) : (
              <>
                Далее
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
