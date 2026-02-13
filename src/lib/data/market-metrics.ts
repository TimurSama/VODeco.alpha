/**
 * Market metrics data for Overview Screen 2
 */

export interface MarketMetric {
  label: string;
  value2025: number;
  value2030: number;
  suffix: string;
  prefix?: string;
  color: string;
  growth?: number;
}

export interface ProblemMetric {
  label: string;
  value2025: number;
  value2030: number;
  suffix: string;
  prefix?: string;
  color: string;
  growth?: number;
}

export const marketMetrics: MarketMetric[] = [
  {
    label: 'Рынок экологии воды',
    value2025: 850,
    value2030: 1200,
    suffix: ' млрд $',
    color: 'text-cyan-glow',
    growth: 41.2,
  },
  {
    label: 'Рынок инвестиций в стартапы',
    value2025: 350,
    value2030: 550,
    suffix: ' млрд $',
    color: 'text-emerald-glow',
    growth: 57.1,
  },
  {
    label: 'Рынок исследований',
    value2025: 180,
    value2030: 280,
    suffix: ' млрд $',
    color: 'text-purple-glow',
    growth: 55.6,
  },
  {
    label: 'Диапазон рентабельности',
    value2025: 12,
    value2030: 25,
    suffix: '%',
    color: 'text-gold-glow',
    growth: 108.3,
  },
];

export const problemMetrics: ProblemMetric[] = [
  {
    label: 'Дефицит инвестиций',
    value2025: 450,
    value2030: 750,
    suffix: ' млрд $',
    color: 'text-rose-glow',
    growth: 66.7,
  },
  {
    label: 'Дефицит бюджетных средств',
    value2025: 320,
    value2030: 580,
    suffix: ' млрд $',
    color: 'text-rose-glow',
    growth: 81.3,
  },
  {
    label: 'Недостаток исследований',
    value2025: 65,
    value2030: 120,
    suffix: ' исследований',
    color: 'text-rose-glow',
    growth: 84.6,
  },
  {
    label: 'Недостаток контроля',
    value2025: 35,
    value2030: 25,
    suffix: '% объектов под контролем',
    color: 'text-rose-glow',
    growth: -28.6,
  },
  {
    label: 'Смерти от загрязненной воды',
    value2025: 2.2,
    value2030: 3.5,
    suffix: ' млн/год',
    color: 'text-rose-glow',
    growth: 59.1,
  },
  {
    label: 'Болезни',
    value2025: 485,
    value2030: 720,
    suffix: ' млн случаев/год',
    color: 'text-rose-glow',
    growth: 48.5,
  },
  {
    label: 'Экономические потери',
    value2025: 280,
    value2030: 450,
    suffix: ' млрд $/год',
    color: 'text-rose-glow',
    growth: 60.7,
  },
];

// Real-time calculator metrics (per second)
export const realTimeMetrics = {
  investmentsPerSecond: 1250, // $ per second
  pollutedWaterPerSecond: 850, // liters per second
};
