'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import InfoPopup from './InfoPopup';
import {
  Droplets,
  Activity,
  Shield,
  Eye,
  Settings,
  ArrowRight,
} from 'lucide-react';

interface OverviewScreen4Props {
  onNext: () => void;
  onPrev: () => void;
}

interface TrustBlock {
  id: string;
  icon: typeof Droplets;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  details: {
    title: string;
    content: string;
    items?: string[];
    metrics?: Array<{ label: string; value: string }>;
  };
}

const trustBlocks: TrustBlock[] = [
  {
    id: 'iot',
    icon: Activity,
    title: 'IoT Датчики',
    subtitle: 'Постоянный мониторинг',
    description: 'Автоматический сбор данных в реальном времени',
    color: 'cyan',
    details: {
      title: 'IoT Датчики мониторинга',
      content: 'Сеть IoT датчиков обеспечивает непрерывный мониторинг качества и состояния воды в реальном времени.',
      items: [
        'pH, мутность, TDS, DO, температура',
        'Прямое подключение к блокчейну',
        'Автоматическая калибровка',
        'Частота обновления: каждые 5-15 минут',
        'Точность измерений: ±2%',
        'Защита от манипуляций',
      ],
      metrics: [
        { label: 'Точность', value: '±2%' },
        { label: 'Частота обновления', value: '5-15 мин' },
        { label: 'Срок службы', value: '5+ лет' },
      ],
    },
  },
  {
    id: 'gamification',
    icon: Droplets,
    title: 'Игровые механики',
    subtitle: 'Гражданская наука',
    description: 'Вовлечение пользователей через геймификацию',
    color: 'emerald',
    details: {
      title: 'VOD Check и геймификация',
      content: 'Мобильное приложение VOD Check позволяет каждому пользователю участвовать в мониторинге воды через простые и увлекательные механики.',
      items: [
        'VOD Check мобильное приложение',
        'Квесты и миссии по анализу воды',
        'Награды за участие и точность',
        'Валидация данных пользователями',
        'Образовательные программы',
        'Система уровней и достижений',
      ],
      metrics: [
        { label: 'Пользователей', value: '10,000+' },
        { label: 'Проверок в день', value: '1,500+' },
        { label: 'Точность', value: '85%+' },
      ],
    },
  },
  {
    id: 'blockchain',
    icon: Shield,
    title: 'Блокчейн',
    subtitle: 'Неизменяемость',
    description: 'Хэширование и запечатывание данных',
    color: 'purple',
    details: {
      title: 'Блокчейн верификация',
      content: 'Все данные о воде хэшируются и запечатываются в блокчейне, обеспечивая неизменяемость и прозрачность.',
      items: [
        'Протокол верификации данных',
        'Data-mint механизм',
        'Прозрачность транзакций',
        'Защита от манипуляций',
        'Аудит данных',
        'Смарт-контракты объектов',
      ],
      metrics: [
        { label: 'Хэшировано данных', value: '1M+' },
        { label: 'Время хэширования', value: '<1 сек' },
        { label: 'Надежность', value: '99.99%' },
      ],
    },
  },
  {
    id: 'monitoring',
    icon: Eye,
    title: 'Социальный мониторинг',
    subtitle: 'Прозрачность',
    description: 'Общественный контроль и участие',
    color: 'gold',
    details: {
      title: 'Открытый социальный мониторинг',
      content: 'Платформа обеспечивает полную прозрачность данных и процессов для всех участников.',
      items: [
        'Публичные дашборды',
        'Социальные сети платформы',
        'Отчеты и аналитика',
        'Голосование сообщества',
        'Модерация контента',
        'Публичные API',
      ],
      metrics: [
        { label: 'Публичных дашбордов', value: '50+' },
        { label: 'Активных участников', value: '25,000+' },
        { label: 'Отчетов в месяц', value: '500+' },
      ],
    },
  },
  {
    id: 'control',
    icon: Settings,
    title: 'Контроль и управление',
    subtitle: 'Управление',
    description: 'Инструменты контроля и принятия решений',
    color: 'rose',
    details: {
      title: 'Системы контроля и управления',
      content: 'Комплексные инструменты для мониторинга, анализа и управления водными ресурсами.',
      items: [
        'Кризисные панели',
        'Предиктивная аналитика',
        'Системы оповещений',
        'Планирование и оптимизация',
        'Интеграция с гос. системами',
        'Цифровые двойники объектов',
      ],
      metrics: [
        { label: 'Объектов под контролем', value: '1,200+' },
        { label: 'Точность прогнозов', value: '92%' },
        { label: 'Время реакции', value: '<5 мин' },
      ],
    },
  },
];

export default function OverviewScreen4({ onNext, onPrev }: OverviewScreen4Props) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const selectedBlockData = trustBlocks.find((b) => b.id === selectedBlock);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      cyan: 'bg-cyan-glow/20 text-cyan-glow border-cyan-glow/50',
      emerald: 'bg-emerald-glow/20 text-emerald-glow border-emerald-glow/50',
      purple: 'bg-purple-glow/20 text-purple-glow border-purple-glow/50',
      gold: 'bg-gold-glow/20 text-gold-glow border-gold-glow/50',
      rose: 'bg-rose-glow/20 text-rose-glow border-rose-glow/50',
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ocean-deep">
      {/* Background Effects - Light gradient for "trust" theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-glow/10 via-transparent to-cyan-glow/10" />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 gradient-text">
            Чистота, частота, сохранность и прозрачность
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Путь доверия и светлого будущего
          </p>
        </motion.div>

        {/* Trust Blocks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {trustBlocks.map((block, idx) => {
            const Icon = block.icon;
            const colorClass = getColorClasses(block.color);

            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedBlock(block.id)}
                className="glass-card p-6 cursor-pointer group hover:scale-105 transition-all"
              >
                <div className={`w-16 h-16 rounded-xl ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-glow transition-colors">
                  {block.title}
                </h3>
                <p className="text-sm text-cyan-glow mb-2">{block.subtitle}</p>
                <p className="text-white/70 text-sm mb-4">{block.description}</p>
                <div className="flex items-center gap-2 text-sm text-cyan-glow">
                  <span>Подробнее</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-8 text-center"
        >
          <p className="text-white/80 text-lg leading-relaxed">
            Комбинация технологий IoT, блокчейна, геймификации и социального мониторинга обеспечивает
            <span className="text-cyan-glow font-semibold"> максимальную прозрачность, достоверность и доверие </span>
            к данным и решениям в управлении водными ресурсами.
          </p>
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

      {/* Info Popup */}
      {selectedBlockData && (
        <InfoPopup
          isOpen={!!selectedBlock}
          onClose={() => setSelectedBlock(null)}
          title={selectedBlockData.details.title}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-white/80 leading-relaxed">{selectedBlockData.details.content}</p>
            {selectedBlockData.details.items && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Возможности:</h4>
                <ul className="space-y-2">
                  {selectedBlockData.details.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/70">
                      <span className="text-cyan-glow mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedBlockData.details.metrics && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Метрики:</h4>
                <div className="grid grid-cols-3 gap-4">
                  {selectedBlockData.details.metrics.map((metric, idx) => (
                    <div key={idx} className="glass-card p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-glow mb-1">{metric.value}</div>
                      <div className="text-xs text-white/60">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InfoPopup>
      )}
    </div>
  );
}
