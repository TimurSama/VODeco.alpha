'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import InfoPopup from './InfoPopup';
import {
  Droplets,
  Users,
  Database,
  Link2,
  Coins,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface OverviewScreen3Props {
  onNext: () => void;
  onPrev: () => void;
}

interface EcosystemBlock {
  id: string;
  icon: typeof Droplets;
  title: string;
  description: string;
  color: string;
  details: {
    title: string;
    content: string;
    items?: string[];
  };
}

const ecosystemBlocks: EcosystemBlock[] = [
  {
    id: 'objects',
    icon: Droplets,
    title: 'Объекты',
    description: 'Физические водные объекты и инфраструктура',
    color: 'cyan',
    details: {
      title: 'Водные объекты',
      content: 'Реестр всех водных объектов в системе: реки, озера, насосные станции, очистные сооружения, водохранилища и другие элементы водной инфраструктуры.',
      items: [
        'Реки и водотоки',
        'Озера и водохранилища',
        'Насосные станции',
        'Очистные сооружения',
        'Водозаборы',
        'Системы водоснабжения',
      ],
    },
  },
  {
    id: 'subjects',
    icon: Users,
    title: 'Субъекты',
    description: 'Участники экосистемы',
    color: 'emerald',
    details: {
      title: 'Участники экосистемы',
      content: 'Все участники платформы VODeco, объединенные по ролям и функциям.',
      items: [
        'Активисты и граждане',
        'Исследователи и ученые',
        'Инженеры и инноваторы',
        'Инвесторы и фонды',
        'Государства и регуляторы',
        'Компании и корпорации',
        'НКО и международные организации',
      ],
    },
  },
  {
    id: 'data',
    icon: Database,
    title: 'Данные',
    description: 'Источники данных о воде',
    color: 'purple',
    details: {
      title: 'Источники данных',
      content: 'Множественные источники данных для обеспечения достоверности и полноты информации.',
      items: [
        'IoT датчики в реальном времени',
        'Спутниковые данные',
        'Лабораторные анализы',
        'Гражданская наука (citizen science)',
        'Внешние API (OSM, USGS, World Bank)',
        'Интеграции с государственными системами',
      ],
    },
  },
  {
    id: 'blockchain',
    icon: Link2,
    title: 'Блокчейн',
    description: 'Неизменяемое хранение и верификация',
    color: 'gold',
    details: {
      title: 'Блокчейн технология',
      content: 'Использование блокчейна для обеспечения прозрачности, неизменяемости и доверия к данным.',
      items: [
        'TON Network как базовая блокчейн-платформа',
        'Хэширование данных воды',
        'Смарт-контракты объектов',
        'Прозрачность всех транзакций',
        'Защита от манипуляций',
        'Аудит и верификация',
      ],
    },
  },
  {
    id: 'economy',
    icon: Coins,
    title: 'Экономика',
    description: 'Токеномика и инвестиционные механизмы',
    color: 'rose',
    details: {
      title: 'Экономическая модель',
      content: 'Токеномика VODeco обеспечивает справедливое распределение ценности и стимулы для участия.',
      items: [
        'VOD credits (pre-sensor)',
        'WTR токены (water-token)',
        'Стейкинг в проекты',
        'Инвестиционные пулы',
        'Награды и стимулы',
        'IRR расчеты',
      ],
    },
  },
  {
    id: 'governance',
    icon: Shield,
    title: 'Управление',
    description: 'Децентрализованное управление',
    color: 'cyan',
    details: {
      title: 'DAO управление',
      content: 'Децентрализованная автономная организация для принятия решений сообществом.',
      items: [
        'Голосование по предложениям',
        'Делегирование голосов',
        'Управление казной',
        'Аудит и комплаенс',
        'Прозрачность решений',
        'Институциональная версия',
      ],
    },
  },
];

export default function OverviewScreen3({ onNext, onPrev }: OverviewScreen3Props) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const selectedBlockData = ecosystemBlocks.find((b) => b.id === selectedBlock);

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
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/10 via-transparent to-emerald-glow/10" />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 gradient-text">
            Решение
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Систематизированное экосистемное объединение всех элементов управления водными ресурсами
          </p>
        </motion.div>

        {/* Ecosystem Blocks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {ecosystemBlocks.map((block, idx) => {
            const Icon = block.icon;
            const isHovered = hoveredBlock === block.id;
            const colorClass = getColorClasses(block.color);

            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onHoverStart={() => setHoveredBlock(block.id)}
                onHoverEnd={() => setHoveredBlock(null)}
                onClick={() => setSelectedBlock(block.id)}
                className="glass-card p-6 cursor-pointer group hover:scale-105 transition-all"
              >
                <div className={`w-16 h-16 rounded-xl ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-glow transition-colors">
                  {block.title}
                </h3>
                <p className="text-white/70 text-sm mb-4">{block.description}</p>
                <div className="flex items-center gap-2 text-sm text-cyan-glow">
                  <span>Подробнее</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Connections Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-8 text-center"
        >
          <p className="text-white/80 text-lg">
            Все блоки связаны между собой, создавая единую экосистему управления водными ресурсами
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
                <h4 className="text-lg font-semibold text-white mb-3">Компоненты:</h4>
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
          </div>
        </InfoPopup>
      )}
    </div>
  );
}
