'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import InfoPopup from './InfoPopup';
import {
  User,
  Building2,
  Bank,
  Anchor,
  Handshake,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface OverviewScreen8Props {
  onNext: () => void;
  onPrev: () => void;
}

interface InvestmentOffer {
  id: string;
  icon: typeof User;
  title: string;
  minAmount: string;
  color: string;
  advantages: string[];
  details: {
    title: string;
    content: string;
    conditions?: string[];
    benefits?: string[];
    risks?: string[];
  };
}

const investmentOffers: InvestmentOffer[] = [
  {
    id: 'private',
    icon: User,
    title: 'Для частного инвестора',
    minAmount: '$1,000',
    color: 'cyan',
    advantages: [
      'Доступ к TokenHub',
      'Стейкинг с APY',
      'Участие в DAO',
      'Награды и бонусы',
    ],
    details: {
      title: 'Инвестиционное предложение для частного инвестора',
      content: 'Идеально для индивидуальных инвесторов, желающих участвовать в экосистеме VODeco.',
      conditions: [
        'Минимальная сумма: $1,000',
        'Доступ к проектам TokenHub',
        'Стейкинг с APY до 25%',
        'Участие в голосовании DAO',
      ],
      benefits: [
        'Прозрачная отчетность',
        'Регулярные обновления',
        'Поддержка сообщества',
        'Ранний доступ к новым проектам',
      ],
    },
  },
  {
    id: 'fund',
    icon: Building2,
    title: 'Для фонда',
    minAmount: '$100,000',
    color: 'emerald',
    advantages: [
      'Приоритетный доступ',
      'Расширенная аналитика',
      'ESG метрики',
      'Прямые инвестиции',
    ],
    details: {
      title: 'Инвестиционное предложение для фонда',
      content: 'Специальные условия для инвестиционных фондов и венчурных капиталистов.',
      conditions: [
        'Минимальная сумма: $100,000',
        'Приоритетный доступ к проектам',
        'Расширенная аналитика и отчетность',
        'ESG метрики и комплаенс',
      ],
      benefits: [
        'Портфель проектов',
        'Прямые инвестиции в инфраструктуру',
        'Стратегическое партнерство',
        'Эксклюзивные возможности',
      ],
    },
  },
  {
    id: 'bank',
    icon: Bank,
    title: 'Для банка',
    minAmount: '$1,000,000',
    color: 'purple',
    advantages: [
      'Инфраструктурные проекты',
      'Долгосрочные инвестиции',
      'Государственные гарантии',
      'Комплаенс панель',
    ],
    details: {
      title: 'Инвестиционное предложение для банка',
      content: 'Крупномасштабные инфраструктурные проекты с государственными гарантиями.',
      conditions: [
        'Минимальная сумма: $1,000,000',
        'Инфраструктурные проекты',
        'Долгосрочные инвестиции (10+ лет)',
        'Государственные гарантии',
      ],
      benefits: [
        'Модель Public-Private Partnership (PPP)',
        'Финансовые инструменты',
        'Риски и хеджирование',
        'Юридическая структура',
      ],
    },
  },
  {
    id: 'anchor',
    icon: Anchor,
    title: 'Для якорного инвестора',
    minAmount: '$10,000,000',
    color: 'gold',
    advantages: [
      'Стратегическое партнерство',
      'Участие в управлении',
      'Эксклюзивные проекты',
      'Брендинг и репутация',
    ],
    details: {
      title: 'Инвестиционное предложение для якорного инвестора',
      content: 'Стратегическое партнерство для крупных институциональных инвесторов.',
      conditions: [
        'Минимальная сумма: $10,000,000',
        'Стратегическое партнерство',
        'Участие в управлении',
        'Эксклюзивные проекты',
      ],
      benefits: [
        'Права и обязанности',
        'Выходные стратегии',
        'ROI прогнозы',
        'Брендинг и репутация',
      ],
    },
  },
  {
    id: 'partner',
    icon: Handshake,
    title: 'Для партнеров',
    minAmount: 'По договоренности',
    color: 'rose',
    advantages: [
      'Совместная разработка',
      'Доступ к экосистеме',
      'Маркетинговая поддержка',
      'Техническая интеграция',
    ],
    details: {
      title: 'Партнерские программы',
      content: 'Технологические, производственные и интеграционные партнерства.',
      conditions: [
        'Технологические партнеры',
        'Производственные партнеры',
        'Интеграционные партнеры',
      ],
      benefits: [
        'Совместная разработка',
        'Доступ к экосистеме',
        'Маркетинговая поддержка',
        'Техническая интеграция',
      ],
    },
  },
];

export default function OverviewScreen8({ onNext, onPrev }: OverviewScreen8Props) {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const selectedOfferData = investmentOffers.find((o) => o.id === selectedOffer);

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

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 gradient-text">
            Инвестиционные предложения
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Специальные условия для разных типов инвесторов
          </p>
        </motion.div>

        {/* Investment Offers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {investmentOffers.map((offer, idx) => {
            const Icon = offer.icon;
            const colorClass = getColorClasses(offer.color);

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedOffer(offer.id)}
                className="glass-card p-6 cursor-pointer group hover:scale-105 transition-all"
              >
                <div className={`w-16 h-16 rounded-xl ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-glow transition-colors">
                  {offer.title}
                </h3>
                <div className="text-sm text-gold-glow font-semibold mb-4">
                  От {offer.minAmount}
                </div>
                <ul className="space-y-2 mb-4">
                  {offer.advantages.slice(0, 3).map((adv, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-emerald-glow" />
                      {adv}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-sm text-cyan-glow">
                  <span>Подробнее</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            Далее
          </button>
        </div>
      </div>

      {/* Info Popup */}
      {selectedOfferData && (
        <InfoPopup
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
          title={selectedOfferData.details.title}
          size="lg"
        >
          <div className="space-y-6">
            <p className="text-white/80 leading-relaxed">{selectedOfferData.details.content}</p>

            {selectedOfferData.details.conditions && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Условия:</h4>
                <ul className="space-y-2">
                  {selectedOfferData.details.conditions.map((condition, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/70">
                      <span className="text-cyan-glow mt-1">•</span>
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedOfferData.details.benefits && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Преимущества:</h4>
                <ul className="space-y-2">
                  {selectedOfferData.details.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/70">
                      <CheckCircle className="w-4 h-4 text-emerald-glow mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedOfferData.details.risks && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Риски:</h4>
                <ul className="space-y-2">
                  {selectedOfferData.details.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/70">
                      <span className="text-rose-glow mt-1">⚠</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button className="flex-1 px-6 py-3 neo-button rounded-xl font-semibold text-white hover:scale-105 transition-all">
                Связаться с нами
              </button>
              <button className="flex-1 px-6 py-3 glass rounded-xl font-semibold text-white hover:bg-white/10 transition-all">
                Скачать презентацию
              </button>
            </div>
          </div>
        </InfoPopup>
      )}
    </div>
  );
}
