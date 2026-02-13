'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Globe3D from '@/components/globe/Globe3D';
import AnimatedCounter from './AnimatedCounter';
import { WaterResource } from '@/lib/api/water-resources';

interface OverviewScreen2Props {
  onNext: () => void;
  onPrev: () => void;
  waterResources: WaterResource[];
}

interface MarketMetric {
  label: string;
  value2025: number;
  value2030: number;
  suffix: string;
  prefix?: string;
  color: string;
}

interface ProblemMetric {
  label: string;
  value2025: number;
  value2030: number;
  suffix: string;
  prefix?: string;
  color: string;
}

const marketMetrics: MarketMetric[] = [
  {
    label: 'Рынок экологии воды',
    value2025: 850,
    value2030: 1200,
    suffix: ' млрд $',
    color: 'text-cyan-glow',
  },
  {
    label: 'Рынок инвестиций в стартапы',
    value2025: 350,
    value2030: 550,
    suffix: ' млрд $',
    color: 'text-emerald-glow',
  },
  {
    label: 'Рынок исследований',
    value2025: 180,
    value2030: 280,
    suffix: ' млрд $',
    color: 'text-purple-glow',
  },
  {
    label: 'Диапазон рентабельности',
    value2025: 12,
    value2030: 25,
    suffix: '%',
    color: 'text-gold-glow',
  },
];

const problemMetrics: ProblemMetric[] = [
  {
    label: 'Дефицит инвестиций',
    value2025: 450,
    value2030: 750,
    suffix: ' млрд $',
    color: 'text-rose-glow',
  },
  {
    label: 'Дефицит бюджетных средств',
    value2025: 320,
    value2030: 580,
    suffix: ' млрд $',
    color: 'text-rose-glow',
  },
  {
    label: 'Недостаток исследований',
    value2025: 65,
    value2030: 120,
    suffix: ' исследований',
    color: 'text-rose-glow',
  },
  {
    label: 'Недостаток контроля',
    value2025: 35,
    value2030: 25,
    suffix: '% объектов под контролем',
    color: 'text-rose-glow',
  },
  {
    label: 'Смерти от загрязненной воды',
    value2025: 2.2,
    value2030: 3.5,
    suffix: ' млн/год',
    color: 'text-rose-glow',
  },
  {
    label: 'Болезни',
    value2025: 485,
    value2030: 720,
    suffix: ' млн случаев/год',
    color: 'text-rose-glow',
  },
  {
    label: 'Экономические потери',
    value2025: 280,
    value2030: 450,
    suffix: ' млрд $/год',
    color: 'text-rose-glow',
  },
];

export default function OverviewScreen2({ onNext, onPrev, waterResources }: OverviewScreen2Props) {
  const [show2025, setShow2025] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartAnimation(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ocean-deep">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/5 via-transparent to-rose-glow/5" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left Panel - Market Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Рынок и возможности</h2>
              <button
                onClick={() => setShow2025(!show2025)}
                className="px-4 py-2 glass rounded-lg text-sm font-semibold text-cyan-glow hover:bg-white/10 transition-colors"
              >
                {show2025 ? '2025' : '2030'}
              </button>
            </div>

            {marketMetrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-4"
              >
                <div className="text-sm text-white/60 mb-2">{metric.label}</div>
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {startAnimation ? (
                    <AnimatedCounter
                      value={show2025 ? metric.value2025 : metric.value2030}
                      duration={2}
                      decimals={metric.value2025 % 1 !== 0 ? 1 : 0}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                    />
                  ) : (
                    '0'
                  )}
                </div>
                {!show2025 && (
                  <div className="text-xs text-emerald-glow mt-1">
                    +{(((metric.value2030 / metric.value2025) - 1) * 100).toFixed(0)}% рост
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Center - Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="w-full h-[600px] relative">
              <div className="absolute inset-0 neo-card rounded-2xl overflow-hidden">
                <Globe3D
                  waterResources={waterResources}
                  onResourceClick={() => {}}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Problem Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Дефициты и проблемы</h2>
              <button
                onClick={() => setShow2025(!show2025)}
                className="px-4 py-2 glass rounded-lg text-sm font-semibold text-rose-glow hover:bg-white/10 transition-colors"
              >
                {show2025 ? '2025' : '2030'}
              </button>
            </div>

            {problemMetrics.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-4 border border-rose-glow/20"
              >
                <div className="text-sm text-white/60 mb-2">{metric.label}</div>
                <div className={`text-xl font-bold ${metric.color}`}>
                  {startAnimation ? (
                    <AnimatedCounter
                      value={show2025 ? metric.value2025 : metric.value2030}
                      duration={2}
                      decimals={metric.value2025 % 1 !== 0 ? 1 : 0}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                    />
                  ) : (
                    '0'
                  )}
                </div>
                {!show2025 && metric.value2030 > metric.value2025 && (
                  <div className="text-xs text-rose-glow mt-1">
                    +{(((metric.value2030 / metric.value2025) - 1) * 100).toFixed(0)}% ухудшение
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Real-time Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Калькулятор в реальном времени
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-sm text-white/60 mb-2">Каждую секунду</div>
              <div className="text-2xl font-bold text-emerald-glow">
                +$<AnimatedCounter value={1250} duration={1} suffix="" />
              </div>
              <div className="text-xs text-white/60 mt-1">инвестиций в экологию воды</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/60 mb-2">Каждую секунду</div>
              <div className="text-2xl font-bold text-rose-glow">
                +<AnimatedCounter value={850} duration={1} suffix="" />
              </div>
              <div className="text-xs text-white/60 mt-1">литров загрязненной воды</div>
            </div>
          </div>
        </motion.div>

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
    </div>
  );
}
