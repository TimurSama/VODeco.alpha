'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, Droplets, Globe, TrendingUp, Shield, Users, Zap, 
  Target, BarChart3, Coins, Lock, CheckCircle2, X, ChevronRight,
  Play, Pause, Award, Building2, Brain, Cpu, Network, Database
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { calculatePurchaseValue, calculateStakingRewards, formatCurrency, formatTokens } from '@/lib/tokenomics/calculations';

// Icon components for funnel stages
function AlertCircle(props: any) {
  return <Shield {...props} />;
}
function Lightbulb(props: any) {
  return <Zap {...props} />;
}
function Rocket(props: any) {
  return <ArrowRight {...props} />;
}

// Sales Funnel Stages
const FUNNEL_STAGES = [
  {
    id: 'awareness',
    title: 'Проблема',
    subtitle: 'Глобальный водный кризис',
    content: '1+ миллиард человек не имеют доступа к чистой воде. К 2030 году это число вырастет до 5+ миллиардов.',
    icon: AlertCircle,
    color: 'neon-rose',
    stats: [
      { label: 'Людей без воды', value: '1+ млрд' },
      { label: 'К 2030 году', value: '5+ млрд' },
    ],
  },
  {
    id: 'interest',
    title: 'Решение',
    subtitle: 'VODeco Platform',
    content: 'Децентрализованная платформа управления водными ресурсами с блокчейном, IoT и ИИ для прозрачного и устойчивого управления водой.',
    icon: Lightbulb,
    color: 'neon-cyan',
    stats: [
      { label: 'Страны', value: '150+' },
      { label: 'Сенсоров', value: '1M+' },
    ],
  },
  {
    id: 'consideration',
    title: 'Возможности',
    subtitle: 'Инвестиции и доходность',
    content: 'Токен VOD обеспечен реальными водными активами. Скидка 80% на покупку токенов. Стейкинг всех исследований открыт с доходностью до 25% годовых.',
    icon: TrendingUp,
    color: 'neon-green',
    stats: [
      { label: 'Скидка', value: '80%' },
      { label: 'APY стейкинг', value: 'до 25%' },
    ],
  },
  {
    id: 'action',
    title: 'Действие',
    subtitle: 'Присоединяйтесь сейчас',
    content: 'Купите токены VOD со скидкой 80%, участвуйте в стейкинге проектов и станьте частью революции в управлении водными ресурсами.',
    icon: Rocket,
    color: 'neon-gold',
    cta: 'Купить токены',
    stats: [
      { label: 'Токенов доступно', value: '1 млрд' },
      { label: 'Проектов', value: '11+' },
    ],
  },
];

// Presentation slides
const PRESENTATION_SLIDES = [
  {
    id: 'hero',
    type: 'hero',
    title: 'VODeco',
    subtitle: 'Революция в управлении водными ресурсами',
    description: 'Децентрализованная платформа, объединяющая блокчейн, IoT и ИИ для устойчивого управления водой',
    background: 'gradient',
  },
  {
    id: 'problem',
    type: 'problem',
    title: 'Глобальный водный кризис',
    stats: [
      { value: '1+ млрд', label: 'человек без доступа к чистой воде' },
      { value: '5+ млрд', label: 'к 2030 году будут испытывать нехватку' },
      { value: '70%', label: 'воды используется в сельском хозяйстве' },
      { value: '2.2 млн', label: 'смертей в год из-за загрязненной воды' },
    ],
    visual: 'chart',
  },
  {
    id: 'solution',
    type: 'solution',
    title: 'VODeco — Решение',
    features: [
      'Блокчейн для прозрачности данных',
      'IoT-сенсоры для мониторинга в реальном времени',
      'ИИ для прогнозирования и оптимизации',
      'DAO для децентрализованного управления',
      'Токенизация водных активов',
    ],
    visual: 'ecosystem',
  },
  {
    id: 'tokenomics',
    type: 'tokenomics',
    title: 'Токеномика VOD',
    keyPoints: [
      { label: '1 VOD', value: '= 1 м³ питьевой воды (мировая средняя стоимость)' },
      { label: 'Текущая цена', value: '$0.26 (скидка 80%)' },
      { label: 'Полная цена', value: '$1.30' },
      { label: 'Общая эмиссия', value: '1 млрд VOD' },
      { label: 'Стейкинг APY', value: 'до 25% годовых' },
    ],
    visual: 'token',
  },
  {
    id: 'projects',
    type: 'projects',
    title: 'Активные проекты',
    projects: [
      { name: '12 станций в Узбекистане', source: 'Uzbekistan', irr: '17%', progress: 30 },
      { name: 'IoT Сенсоры', source: 'VOD Team', irr: '18%', progress: 25 },
      { name: 'ИИ Аналитика', source: 'VOD Team', irr: '22%', progress: 1 },
      { name: 'VOD Check', source: 'VOD Team', irr: '20%', progress: 25 },
    ],
    visual: 'map',
  },
  {
    id: 'cta',
    type: 'cta',
    title: 'Присоединяйтесь к революции',
    subtitle: 'Инвестируйте в будущее воды',
    cta: 'Купить токены',
    benefits: [
      'Скидка 80% на покупку',
      'Стейкинг с доходностью до 25%',
      'Участие в DAO управлении',
      'Поддержка реальных проектов',
    ],
  },
];

export default function OverviewPage() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Auto-play presentation
  useEffect(() => {
    if (isPlaying && currentSlide < PRESENTATION_SLIDES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % PRESENTATION_SLIDES.length);
      }, 8000); // 8 seconds per slide
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentSlide]);

  const openModal = (content: any) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  // Calculate token purchase example
  const purchaseExample = calculatePurchaseValue(1000); // $1000 investment
  const stakingExample = calculateStakingRewards(purchaseExample.tokens, 12, 'research');

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-8"
          >
            <Droplets className="w-24 h-24 md:w-32 md:h-32 text-neon-cyan mx-auto mb-6" />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
            VODeco
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-4xl text-white/90 mb-4"
          >
            Революция в управлении водными ресурсами
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl mx-auto"
          >
            Децентрализованная платформа, объединяющая блокчейн, IoT и ИИ для прозрачного и устойчивого управления водными ресурсами
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-8 py-4 bg-neon-cyan text-white rounded-lg font-semibold hover:bg-neon-cyan/80 transition-colors flex items-center gap-2 neon-glow"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Пауза' : 'Смотреть презентацию'}
            </button>
            <Link
              href="/wallet"
              className="px-8 py-4 glass rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              Купить токены
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/whitepaper"
              className="px-8 py-4 neo-button rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              WhitePaper
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { label: 'Страны', value: '150+' },
              { label: 'Сенсоров', value: '1M+' },
              { label: 'Проектов', value: '11+' },
              { label: 'APY', value: 'до 25%' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-neon-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Sales Funnel Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-16 text-center gradient-text"
          >
            Воронка продаж
          </motion.h2>

          <div className="space-y-8">
            {FUNNEL_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="glass-card p-8 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => openModal(stage)}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-${stage.color}/20 text-${stage.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-white/60">Этап {index + 1}</span>
                        <span className={`px-3 py-1 rounded-full text-xs bg-${stage.color}/20 text-${stage.color}`}>
                          {stage.id}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{stage.title}</h3>
                      <p className="text-lg text-white/80 mb-4">{stage.subtitle}</p>
                      <p className="text-white/70">{stage.content}</p>
                      {stage.stats && (
                        <div className="flex gap-6 mt-4">
                          {stage.stats.map((stat, i) => (
                            <div key={i}>
                              <div className="text-2xl font-bold text-neon-cyan">{stat.value}</div>
                              <div className="text-sm text-white/60">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {stage.cta && (
                      <Link
                        href="/wallet"
                        className="px-6 py-3 bg-neon-green text-white rounded-lg font-semibold hover:bg-neon-green/80 transition-colors flex items-center gap-2"
                      >
                        {stage.cta}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}
                    <ChevronRight className="w-6 h-6 text-white/40 hidden md:block" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Presentation Slides */}
      {isPlaying && (
        <section className="fixed inset-0 z-50 bg-ocean-deep/95 backdrop-blur-md flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 text-white hover:text-neon-cyan transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-5xl mx-auto px-4"
            >
              {renderSlide(PRESENTATION_SLIDES[currentSlide])}
            </motion.div>
          </AnimatePresence>

          {/* Slide Navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {PRESENTATION_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-neon-cyan w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-deep/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-bold">{modalContent.title}</h3>
                <button onClick={closeModal} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {modalContent.subtitle && (
                <p className="text-xl text-white/80 mb-4">{modalContent.subtitle}</p>
              )}
              <p className="text-white/70 mb-6">{modalContent.content}</p>
              {modalContent.stats && (
                <div className="grid grid-cols-2 gap-4">
                  {modalContent.stats.map((stat: any, i: number) => (
                    <div key={i} className="glass p-4 rounded-lg">
                      <div className="text-2xl font-bold text-neon-cyan mb-1">{stat.value}</div>
                      <div className="text-sm text-white/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function renderSlide(slide: any) {
  switch (slide.type) {
    case 'hero':
      return (
        <div className="text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">{slide.title}</h2>
          <p className="text-3xl md:text-4xl text-white/80 mb-4">{slide.subtitle}</p>
          <p className="text-xl text-white/60">{slide.description}</p>
        </div>
      );
    case 'problem':
      return (
        <div>
          <h2 className="text-5xl font-bold mb-8 text-center gradient-text">{slide.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {slide.stats.map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="text-4xl font-bold text-neon-rose mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'solution':
      return (
        <div>
          <h2 className="text-5xl font-bold mb-8 text-center gradient-text">{slide.title}</h2>
          <div className="space-y-4">
            {slide.features.map((feature: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <CheckCircle2 className="w-6 h-6 text-neon-green flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'tokenomics':
      return (
        <div>
          <h2 className="text-5xl font-bold mb-8 text-center gradient-text">{slide.title}</h2>
          <div className="space-y-4">
            {slide.keyPoints.map((point: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex justify-between items-center"
              >
                <span className="text-xl font-semibold">{point.label}</span>
                <span className="text-xl text-neon-cyan">{point.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'projects':
      return (
        <div>
          <h2 className="text-5xl font-bold mb-8 text-center gradient-text">{slide.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {slide.projects.map((project: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <span className="px-3 py-1 glass rounded-full text-xs">
                    {project.source}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60">IRR</span>
                  <span className="text-2xl font-bold text-neon-green">{project.irr}</span>
                </div>
                <div className="w-full h-2 glass rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-green"
                  />
                </div>
                <div className="text-sm text-white/60 mt-2">Прогресс: {project.progress}%</div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'cta':
      return (
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{slide.title}</h2>
          <p className="text-2xl text-white/80 mb-8">{slide.subtitle}</p>
          <div className="space-y-3 mb-8">
            {slide.benefits.map((benefit: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-neon-green" />
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
          <Link
            href="/wallet"
            className="inline-flex items-center gap-2 px-12 py-6 bg-neon-cyan text-white rounded-lg font-bold text-xl hover:bg-neon-cyan/80 transition-colors neon-glow"
          >
            {slide.cta}
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      );
    default:
      return null;
  }
}
