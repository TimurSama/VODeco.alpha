'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import InfoPopup from './InfoPopup';
import {
  MapPin,
  Droplets,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Building2,
} from 'lucide-react';

interface OverviewScreen9Props {
  onNext: () => void;
  onPrev: () => void;
}

interface ProblemRegion {
  id: string;
  name: string;
  location: string;
  icon: typeof MapPin;
  problems: string[];
  solutions: Array<{
    title: string;
    description: string;
    projects?: Array<{
      name: string;
      cost: string;
      irr?: string;
      status: string;
    }>;
  }>;
  details: {
    title: string;
    content: string;
    impact?: string;
    timeline?: string;
  };
}

const problemRegions: ProblemRegion[] = [
  {
    id: 'central-asia',
    name: 'Средняя Азия',
    location: 'Узбекистан, Казахстан, Кыргызстан',
    icon: MapPin,
    problems: [
      'Кризис водных ресурсов',
      'Потери воды в инфраструктуре',
      'Недостаток средств на модернизацию',
      'Дефицит энергии и других ресурсов',
    ],
    solutions: [
      {
        title: 'Реконструкция насосных станций',
        description: 'Модернизация насосных станций для минимизации потерь воды и оптимизации ресурсов.',
        projects: [
          {
            name: 'Pumping Station No.2 (Джизак)',
            cost: '$7,760,600',
            irr: '17%',
            status: 'Начало реализации',
          },
          {
            name: 'Korovulbozor (Бухара)',
            cost: '$6,189,700',
            irr: '15%',
            status: 'Начало реализации',
          },
          {
            name: 'Kuyumazar (Бухара)',
            cost: '$11,965,400',
            irr: '22%',
            status: 'Начало реализации',
          },
          {
            name: 'Amu-Bukhara-1 (Бухара)',
            cost: '$9,490,100',
            irr: '20%',
            status: 'Начало реализации',
          },
        ],
      },
      {
        title: 'Строительство водоочистных станций',
        description: 'Создание новых и модернизация существующих водоочистных сооружений.',
      },
      {
        title: 'Восстановление Аральского моря',
        description: 'Мегапроект по перенаправлению рек с сезонными паводками для восстановления Аральского моря.',
        projects: [
          {
            name: 'Мегапроект восстановления Аральского моря',
            cost: '$XXX млн',
            status: 'Концепция',
          },
        ],
      },
    ],
    details: {
      title: 'Кризис водных ресурсов в Средней Азии',
      content: 'Регион сталкивается с серьезным водным кризисом из-за устаревшей инфраструктуры, потерь воды и недостатка инвестиций. VODeco предлагает комплексное решение через модернизацию инфраструктуры и внедрение IoT мониторинга.',
      impact: 'Ожидаемое сокращение потерь воды на 40-60%, оптимизация энергопотребления на 30%, улучшение качества воды.',
      timeline: '2025-2030: Поэтапная реализация проектов модернизации',
    },
  },
  {
    id: 'israel',
    name: 'Израиль',
    location: 'Израиль',
    icon: Building2,
    problems: [
      'Дефицит бюджетных средств',
      'Отказ от анализа и контроля питьевой воды',
      'Отказ от анализа морской воды',
      'Недостаток постоянного мониторинга',
    ],
    solutions: [
      {
        title: 'Унифицированные датчики мониторинга',
        description: 'Внедрение IoT датчиков с прямым хэшированием в блокчейн для постоянного мониторинга.',
      },
      {
        title: 'Системы аналитики и расчетов',
        description: 'Автоматизированные системы для анализа данных и оптимизации процессов.',
      },
      {
        title: 'Продвижение инициатив',
        description: 'Развитие проектов и продуктов в ProjectHUB, образовательные программы, партнерства.',
      },
    ],
    details: {
      title: 'Дефицит бюджетных средств и контроля в Израиле',
      content: 'Израиль сталкивается с дефицитом бюджетных средств для постоянного мониторинга и контроля качества воды. VODeco предлагает решение через унифицированные IoT датчики и системы аналитики.',
      impact: 'Постоянный мониторинг качества воды, автоматизированный контроль, снижение затрат на ручной анализ на 70%.',
      timeline: '2025-2027: Пилотное внедрение, масштабирование',
    },
  },
];

export default function OverviewScreen9({ onNext, onPrev }: OverviewScreen9Props) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const selectedRegionData = problemRegions.find((r) => r.id === selectedRegion);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ocean-deep">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-glow/10 via-transparent to-cyan-glow/10" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4 gradient-text">
            Проблемы, которые мы решаем
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Реальные регионы с реальными решениями
          </p>
        </motion.div>

        {/* Problem Regions */}
        <div className="space-y-8 mb-12">
          {problemRegions.map((region, idx) => {
            const Icon = region.icon;
            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="glass-card p-8 cursor-pointer hover:scale-[1.01] transition-all"
                onClick={() => setSelectedRegion(region.id)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-rose-glow/20 text-rose-glow flex items-center justify-center">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{region.name}</h3>
                      <p className="text-cyan-glow">{region.location}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-cyan-glow" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Problems */}
                  <div>
                    <h4 className="text-lg font-semibold text-rose-glow mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Проблемы
                    </h4>
                    <ul className="space-y-2">
                      {region.problems.map((problem, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/70">
                          <span className="text-rose-glow mt-1">•</span>
                          <span>{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-glow mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Решения
                    </h4>
                    <ul className="space-y-2">
                      {region.solutions.slice(0, 3).map((solution, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/70">
                          <span className="text-emerald-glow mt-1">✓</span>
                          <span>{solution.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
            Завершить
          </button>
        </div>
      </div>

      {/* Region Details Popup */}
      {selectedRegionData && (
        <InfoPopup
          isOpen={!!selectedRegion}
          onClose={() => setSelectedRegion(null)}
          title={selectedRegionData.details.title}
          size="xl"
        >
          <div className="space-y-6">
            <p className="text-white/80 leading-relaxed">{selectedRegionData.details.content}</p>

            {selectedRegionData.details.impact && (
              <div className="glass-card p-4">
                <h4 className="text-lg font-semibold text-white mb-2">Ожидаемое воздействие</h4>
                <p className="text-white/80">{selectedRegionData.details.impact}</p>
              </div>
            )}

            {selectedRegionData.details.timeline && (
              <div className="glass-card p-4">
                <h4 className="text-lg font-semibold text-white mb-2">Временные рамки</h4>
                <p className="text-white/80">{selectedRegionData.details.timeline}</p>
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Проблемы</h4>
              <ul className="space-y-2">
                {selectedRegionData.problems.map((problem, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/70">
                    <span className="text-rose-glow mt-1">•</span>
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Решения</h4>
              <div className="space-y-4">
                {selectedRegionData.solutions.map((solution, idx) => (
                  <div key={idx} className="glass-card p-4">
                    <h5 className="text-lg font-semibold text-emerald-glow mb-2">{solution.title}</h5>
                    <p className="text-white/80 mb-3">{solution.description}</p>
                    {solution.projects && (
                      <div className="space-y-2">
                        {solution.projects.map((project, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between p-2 bg-white/5 rounded">
                            <div>
                              <div className="font-semibold text-white">{project.name}</div>
                              <div className="text-sm text-white/60">{project.cost}</div>
                            </div>
                            <div className="text-right">
                              {project.irr && (
                                <div className="text-emerald-glow font-semibold">{project.irr}</div>
                              )}
                              <div className="text-xs text-white/60">{project.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </InfoPopup>
      )}
    </div>
  );
}
