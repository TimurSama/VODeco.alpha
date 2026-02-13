'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import InfoPopup from './InfoPopup';
import {
  Coins,
  TrendingUp,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface OverviewScreen7Props {
  onNext: () => void;
  onPrev: () => void;
}

interface TokenomicsBlock {
  id: string;
  icon: typeof Coins;
  title: string;
  description: string;
  color: string;
  details: {
    title: string;
    content: string;
    items?: string[];
    formula?: string;
  };
}

const tokenomicsBlocks: TokenomicsBlock[] = [
  {
    id: 'vod-credits',
    icon: Coins,
    title: 'VOD Credits',
    description: 'Pre-sensor внутренняя расчетная единица',
    color: 'cyan',
    details: {
      title: 'VOD Credits (Pre-sensor)',
      content: 'Внутренняя расчетная единица для MVP, используемая до появления сенсоров и верификации данных воды.',
      items: [
        'Используется для участия и стейкинга',
        'Симуляции и UX-сценарии',
        'Конвертация в WTR после data-mint фазы',
        'Опциональный lock-period на ранние покупки',
      ],
    },
  },
  {
    id: 'wtr',
    icon: TrendingUp,
    title: 'WTR (Water Token)',
    description: 'Эмиссия только после подтвержденных данных',
    color: 'emerald',
    details: {
      title: 'WTR (Water Token)',
      content: 'Эмиссия WTR происходит строго по подтвержденным данным воды. 1 WTR = W_m3 (индекс средней стоимости м³).',
      items: [
        'Эмиссия только при подтверждении данных воды',
        '1 WTR = W_m3 (индекс средней стоимости м³)',
        'Предназначен для data-anchoring',
        'Прозрачное управление водными ресурсами',
      ],
      formula: '1 WTR = W_m3 (индекс средней стоимости м³)',
    },
  },
  {
    id: 'emission',
    icon: Zap,
    title: 'Эмиссия',
    description: 'Строго по данным воды',
    color: 'purple',
    details: {
      title: 'Механика эмиссии',
      content: 'Процесс эмиссии WTR происходит только после полной верификации данных о воде.',
      items: [
        'IoT-датчик фиксирует параметры',
        'Данные проходят верификацию',
        'Хэш и метаданные фиксируются в нодах',
        'Эмиссия: 1 WTR за 1 м³ подтвержденной воды',
      ],
    },
  },
  {
    id: 'phases',
    icon: ArrowRight,
    title: 'Фазы эволюции',
    description: 'Развитие токена по этапам',
    color: 'gold',
    details: {
      title: 'Эволюция токена',
      content: 'Токен развивается вместе с платформой от базового участия до полного управления ресурсами.',
      items: [
        'Фаза 0: Pre-sensor Credits',
        'Фаза 1: Access & Participation',
        'Фаза 2: Staking & Governance / TokenHub',
        'Фаза 3: Data Anchoring',
        'Фаза 4: Resource-Linked',
      ],
    },
  },
  {
    id: 'stabilization',
    icon: Lock,
    title: 'Стабилизация',
    description: 'Защита от спекуляций',
    color: 'rose',
    details: {
      title: 'Механизмы стабилизации',
      content: 'Система защиты от спекуляций и обеспечения стабильности токена.',
      items: [
        'Water-peg (привязка к воде, а не фиату)',
        'Динамический спред (покупка/выкуп)',
        'Ограничение DEX-торговли на старте',
        'Вестинг и блокировки для ранних участий',
      ],
    },
  },
  {
    id: 'discounts',
    icon: CheckCircle,
    title: 'Скидки на старте',
    description: 'Вознаграждение за раннюю поддержку',
    color: 'cyan',
    details: {
      title: 'Стартовые скидки',
      content: 'Специальные условия для ранних участников проекта.',
      items: [
        'Скидка доступна в VOD credits',
        'Конвертация в WTR после data-mint фазы',
        'Опциональный lock-period',
        'До 80% скидка для ранних участников',
      ],
    },
  },
];

export default function OverviewScreen7({ onNext, onPrev }: OverviewScreen7Props) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const selectedBlockData = tokenomicsBlocks.find((b) => b.id === selectedBlock);

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
      <div className="absolute inset-0 bg-gradient-to-br from-gold-glow/10 via-transparent to-cyan-glow/10" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4 gradient-text">
            Токеномика и экономика проекта
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Экономическая модель VODeco обеспечивает справедливое распределение ценности
          </p>
        </motion.div>

        {/* Tokenomics Blocks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tokenomicsBlocks.map((block, idx) => {
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

        {/* Key Principle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-8 text-center mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Главный принцип
          </h3>
          <p className="text-white/80 text-lg leading-relaxed">
            <span className="text-cyan-glow font-semibold">Ценовая якорная единица — вода, а не фиат.</span>
            <br />
            Базовое определение: <span className="text-gold-glow font-semibold">1 WTR = 1 м³ воды по индексу средней стоимости (W_m3)</span>
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
            {selectedBlockData.details.formula && (
              <div className="glass-card p-4">
                <div className="text-sm text-white/60 mb-1">Формула</div>
                <div className="text-lg font-semibold text-cyan-glow">{selectedBlockData.details.formula}</div>
              </div>
            )}
            {selectedBlockData.details.items && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Детали:</h4>
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
