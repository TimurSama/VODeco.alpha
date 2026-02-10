'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Info, AlertTriangle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  important?: boolean;
}

const faqCategories = [
  'Общее',
  'VOD Credits',
  'WTR Token',
  'Миссии и награды',
  'Стейкинг',
  'Риски',
];

const faqData: FAQItem[] = [
  // Общее
  {
    id: 'what-is-vodeco',
    category: 'Общее',
    question: 'Что такое VODeco?',
    answer: 'VODeco — это децентрализованная платформа для управления водными ресурсами с интеграцией блокчейна. Мы объединяем IoT-сенсоры, данные о воде и токеномику для создания прозрачной экосистемы управления водными ресурсами.',
  },
  {
    id: 'how-to-start',
    category: 'Общее',
    question: 'Как начать использовать платформу?',
    answer: 'Зарегистрируйтесь через Telegram, выберите свою роль (активист, исследователь, инженер и т.д.), завершите онбординг и начните участвовать в миссиях, публиковать контент и получать награды.',
  },
  {
    id: 'roles',
    category: 'Общее',
    question: 'Какие роли доступны?',
    answer: 'Доступно 8 ролей: активист, исследователь, инженер, инвестор, компания, НКО, правительство и институт. Каждая роль предоставляет уникальные возможности и инструменты.',
  },

  // VOD Credits
  {
    id: 'what-is-vod',
    category: 'VOD Credits',
    question: 'Что такое VOD Credits?',
    answer: 'VOD Credits — это предсенсорные токены (pre-sensor tokens), которые используются в MVP для награждения пользователей за участие в платформе. Они могут быть конвертированы в WTR токены после запуска сенсорной сети.',
    important: true,
  },
  {
    id: 'how-to-earn-vod',
    category: 'VOD Credits',
    question: 'Как заработать VOD Credits?',
    answer: 'Вы можете заработать VOD Credits через: участие в миссиях, публикацию контента, реферальную программу, социальные шары, стейкинг и другие активности на платформе.',
  },
  {
    id: 'vod-to-wtr',
    category: 'VOD Credits',
    question: 'Как конвертировать VOD в WTR?',
    answer: 'Конвертация VOD Credits в WTR токены будет доступна после запуска сенсорной сети и верификации данных о воде. Детали конвертации будут объявлены позже.',
    important: true,
  },

  // WTR Token
  {
    id: 'what-is-wtr',
    category: 'WTR Token',
    question: 'Что такое WTR Token?',
    answer: 'WTR (Water Token) — это основной токен платформы, который будет эмитироваться на основе верифицированных данных от IoT-сенсоров. WTR представляет реальную ценность водных ресурсов.',
    important: true,
  },
  {
    id: 'wtr-emission',
    category: 'WTR Token',
    question: 'Как происходит эмиссия WTR?',
    answer: 'WTR токены эмитируются на основе данных от верифицированных IoT-сенсоров. Каждый кубометр воды, измеренный и верифицированный сенсором, может генерировать WTR токены согласно токеномике платформы.',
  },
  {
    id: 'wtr-utility',
    category: 'WTR Token',
    question: 'Для чего можно использовать WTR?',
    answer: 'WTR токены можно использовать для: стейкинга в проекты, участия в DAO-голосованиях, оплаты услуг платформы, инвестирования в водные проекты и других операций в экосистеме.',
  },

  // Миссии и награды
  {
    id: 'missions',
    category: 'Миссии и награды',
    question: 'Что такое миссии?',
    answer: 'Миссии — это задания, которые пользователи могут выполнять для получения наград. Типы миссий: вакансии, задачи, новостные публикации, партнёрства. Каждая миссия имеет свою награду в VOD Credits.',
  },
  {
    id: 'rewards',
    category: 'Миссии и награды',
    question: 'Как рассчитываются награды?',
    answer: 'Награды рассчитываются на основе сложности миссии, типа задания и качества выполнения. Система использует токеномику для справедливого распределения наград.',
  },
  {
    id: 'levels',
    category: 'Миссии и награды',
    question: 'Как работает система уровней?',
    answer: 'Пользователи получают опыт (XP) за различные активности. При накоплении достаточного опыта уровень повышается. Высокие уровни открывают дополнительные возможности, такие как стейкинг и приоритетная поддержка.',
  },

  // Стейкинг
  {
    id: 'staking',
    category: 'Стейкинг',
    question: 'Что такое стейкинг?',
    answer: 'Стейкинг — это блокировка VOD Credits в проектах на определённый срок для получения процентов (APY). Стейкинг помогает финансировать водные проекты и приносит пассивный доход.',
  },
  {
    id: 'staking-requirements',
    category: 'Стейкинг',
    question: 'Какие требования для стейкинга?',
    answer: 'Для стейкинга необходимо: уровень 2+, или 3 выполненные миссии, или 5 активных рефералов, или 10 публикаций. Это обеспечивает активное участие в платформе.',
  },
  {
    id: 'staking-apy',
    category: 'Стейкинг',
    question: 'Какая доходность стейкинга?',
    answer: 'APY зависит от срока стейкинга и типа проекта. Более длительные сроки и проекты с высоким IRR предлагают более высокую доходность. Детали доступны на странице каждого проекта.',
  },

  // Риски
  {
    id: 'risks',
    category: 'Риски',
    question: 'Какие риски связаны с платформой?',
    answer: 'Платформа находится в стадии MVP. Существуют риски, связанные с технологиями, регуляцией, ликвидностью токенов и реализацией сенсорной сети. Инвестируйте только то, что можете позволить себе потерять.',
    important: true,
  },
  {
    id: 'not-investment',
    category: 'Риски',
    question: 'Является ли это инвестиционным советом?',
    answer: 'Нет. Информация на платформе не является инвестиционным советом. Все решения принимаются на ваш собственный риск. Рекомендуется консультация с финансовым советником.',
    important: true,
  },
  {
    id: 'regulatory',
    category: 'Риски',
    question: 'Как платформа относится к регуляции?',
    answer: 'Мы следуем применимым законам и правилам. Токены могут подпадать под регуляцию в различных юрисдикциях. Пользователи несут ответственность за соблюдение местного законодательства.',
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFAQs = selectedCategory === 'Все'
    ? faqData
    : faqData.filter((item) => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
      trackEvent('faq_opened', { questionId: id, category: faqData.find((f) => f.id === id)?.category });
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Часто задаваемые вопросы</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Ответы на самые популярные вопросы о VODeco, токенах, миссиях и платформе
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['Все', ...faqCategories].map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                trackEvent('faq_category_selected', { category });
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-cyan-glow text-white'
                  : 'bg-ocean-mid text-slate-300 hover:bg-ocean-light'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => {
            const isOpen = openItems.has(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 flex items-start justify-between gap-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.important && (
                        <AlertTriangle className="w-4 h-4 text-gold-glow flex-shrink-0" />
                      )}
                      <h3 className="font-bold text-white">{item.question}</h3>
                    </div>
                    <span className="text-xs text-cyan-glow/70 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-300 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 glass-card p-6 text-center">
          <Info className="w-8 h-8 text-cyan-glow mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Не нашли ответ?</h3>
          <p className="text-slate-400 mb-4">
            Свяжитесь с нами через форму для партнёров или инвесторов
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/partners"
              className="px-6 py-3 bg-gradient-to-r from-cyan-glow to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Для партнёров
            </a>
            <a
              href="/investors"
              className="px-6 py-3 bg-ocean-mid text-white rounded-lg font-semibold hover:bg-ocean-light transition-colors"
            >
              Для инвесторов
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
