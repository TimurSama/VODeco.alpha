'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Link as LinkIcon,
  X,
  ExternalLink,
  Calculator,
  Layers,
  Shield,
  Database,
  Globe,
  Landmark,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import {
  calculatePurchaseValue,
  calculateProjectReturns,
  calculateStakingRewards,
  CURRENT_DISCOUNT,
  CURRENT_TOKEN_PRICE,
  FULL_TOKEN_PRICE,
  TOTAL_SUPPLY,
  formatCurrency,
  formatTokens,
} from '@/lib/tokenomics/calculations';

type IconComponent = React.ComponentType<{ className?: string }>;

type DocKey = 'index' | 'mission' | 'tokenomics' | 'mvpMap' | 'spec';

const CANON_DOCS: Record<DocKey, { title: string; file: string; icon: IconComponent }> = {
  index: { title: 'Индекс канона', file: 'VODeco_Canon/00_INDEX.md', icon: FileText },
  mission: { title: 'Экосистема и миссия', file: 'VODeco_Canon/01_Экосистема_и_миссия.md', icon: Globe },
  tokenomics: { title: 'Токеномика и экономика', file: 'VODeco_Canon/05_Токеномика_и_экономика.md', icon: TrendingUp },
  mvpMap: { title: 'Карта реализации MVP', file: 'VODeco_Canon/09_Текущая_реализация_MVP_карта.md', icon: Database },
  spec: { title: 'Спецификация интерактивного WhitePaper', file: 'VODeco_Canon/11_Спецификация_интерактивного_WhitePaper.md', icon: Layers },
};

type Project = {
  id: string;
  name: string;
  slug: string;
  irr?: string | null;
  targetAmount?: string | null;
  currentAmount: string;
  type: string;
  location?: string | null;
  metadata?: string | null;
};

type WaterResource = {
  id: string;
  name: string;
  type: string;
  category: string;
  country?: string | null;
  region?: string | null;
  qualityIndex?: number | null;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseNumber(n?: string | null): number | null {
  if (!n) return null;
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

function Section({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  icon: IconComponent;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="glass-card">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-glow/15 border border-cyan-glow/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-cyan-glow" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-white">{title}</h2>
            {subtitle && <p className="mt-1 text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function DocModal({
  open,
  onClose,
  title,
  file,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  file: string;
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!open) return;
      setLoading(true);
      setError('');
      setContent('');
      try {
        const res = await fetch(`/api/docs?file=${encodeURIComponent(file)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load doc');
        if (!cancelled) setContent(data.content || '');
      } catch (e: unknown) {
        const msg =
          typeof e === 'object' && e && 'message' in e && typeof (e as { message?: unknown }).message === 'string'
            ? (e as { message: string }).message
            : 'Failed to load doc';
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [open, file]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="neo-card w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-slate-400">Источник</div>
                <div className="font-bold text-white truncate">{title}</div>
                <div className="text-xs text-slate-500 truncate">{file}</div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  className="px-3 py-2 glass rounded-xl text-sm font-semibold hover:bg-white/5 transition-all inline-flex items-center gap-2"
                  href={`/api/docs?file=${encodeURIComponent(file)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Открыть сырой документ"
                >
                  <ExternalLink className="w-4 h-4" />
                  Raw
                </a>
                <button
                  className="p-2 neo-button rounded-xl active:scale-95 transition-all"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-64px)]">
              {loading && <div className="text-slate-400">Загрузка…</div>}
              {error && <div className="text-rose-300">{error}</div>}
              {!loading && !error && (
                <pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">
                  {content}
                </pre>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function WhitePaperPage() {
  const [activeDoc, setActiveDoc] = useState<DocKey | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resources, setResources] = useState<WaterResource[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Calculators state
  const [buyUsd, setBuyUsd] = useState(1000);
  const [stakeMonths, setStakeMonths] = useState(12);
  const [stakeType, setStakeType] = useState<'basic' | 'project' | 'research'>('research');
  const [projectIrr, setProjectIrr] = useState(18);
  const [projectDuration, setProjectDuration] = useState(18);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingData(true);
      try {
        const [p, r] = await Promise.allSettled([
          fetch('/api/projects').then((x) => x.json()),
          fetch('/api/water-resources?external=true').then((x) => x.json()),
        ]);
        if (cancelled) return;
        if (p.status === 'fulfilled' && Array.isArray(p.value)) setProjects(p.value);
        if (r.status === 'fulfilled' && Array.isArray(r.value)) setResources(r.value);
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const purchase = useMemo(() => calculatePurchaseValue(clamp(buyUsd, 0, 1_000_000)), [buyUsd]);
  const staking = useMemo(
    () => calculateStakingRewards(purchase.tokens, clamp(stakeMonths, 1, 60), stakeType),
    [purchase.tokens, stakeMonths, stakeType]
  );
  const projectReturns = useMemo(
    () => calculateProjectReturns(purchase.tokens, clamp(projectIrr, 0, 100), clamp(projectDuration, 1, 120)),
    [purchase.tokens, projectIrr, projectDuration]
  );

  const countries = useMemo(() => {
    const set = new Set(resources.map((r) => r.country).filter(Boolean) as string[]);
    return set.size;
  }, [resources]);

  const avgQuality = useMemo(() => {
    const vals = resources
      .map((r) => (typeof r.qualityIndex === 'number' ? r.qualityIndex : null))
      .filter((x): x is number => x !== null);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [resources]);

  const toc = [
    { id: 'hero', label: 'Кратко' },
    { id: 'ecosystem', label: 'Экосистема' },
    { id: 'architecture', label: 'Архитектура слоёв' },
    { id: 'data', label: 'Данные и доверие' },
    { id: 'economy', label: 'Экономика и TokenHub' },
    { id: 'token', label: 'Токен и фазы' },
    { id: 'staking', label: 'Стейкинг и доходность' },
    { id: 'dao', label: 'DAO и управление' },
    { id: 'mvp', label: 'Что уже сделано (MVP)' },
    { id: 'sources', label: 'Источники' },
  ];

  const updateStakeType = (value: string) => {
    if (value === 'basic' || value === 'project' || value === 'research') setStakeType(value);
  };

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <BookOpen className="w-4 h-4" />
                Smart WhitePaper (интерактивная версия)
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">VODeco WhitePaper</h1>
              <p className="text-slate-400 mt-2 max-w-3xl">
                Максимально подробная “карта смысла”: слои экосистемы → механики → калькуляторы → live-данные → источники в каноне.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/overview" className="px-4 py-2 glass rounded-xl font-semibold hover:bg-white/5 transition-all">
                Презентация
              </Link>
              <Link href="/projects" className="px-4 py-2 glass rounded-xl font-semibold hover:bg-white/5 transition-all">
                Проекты (TokenHub)
              </Link>
              <Link href="/dashboard" className="px-4 py-2 glass rounded-xl font-semibold hover:bg-white/5 transition-all">
                Дашборд
              </Link>
              <Link href="/wallet" className="px-4 py-2 neo-button rounded-xl font-semibold">
                Кошелёк
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* TOC */}
          <aside className="lg:col-span-3">
            <div className="neo-card p-4 sticky top-24">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">Содержание</div>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block px-3 py-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-5 pt-5 border-t border-white/10">
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">Канон (источники)</div>
                <div className="space-y-2">
                  {(Object.keys(CANON_DOCS) as DocKey[]).map((key) => {
                    const d = CANON_DOCS[key];
                    const Icon = d.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveDoc(key)}
                        className="w-full text-left px-3 py-2 rounded-xl glass hover:bg-white/5 transition-all flex items-center gap-3"
                      >
                        <Icon className="w-4 h-4 text-cyan-glow" />
                        <span className="text-sm font-semibold text-slate-200">{d.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-9 space-y-6">
            <Section
              id="hero"
              icon={BookOpen}
              title="Кратко: что это и зачем"
              subtitle="VODeco — инфраструктура доверия к водным данным и решениям, а не “продажа воды на блокчейне”."
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Текущая цена (MVP)</div>
                  <div className="text-2xl font-black text-cyan-glow">{formatCurrency(CURRENT_TOKEN_PRICE)}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    Скидка: {(CURRENT_DISCOUNT * 100).toFixed(0)}% • Полная: {formatCurrency(FULL_TOKEN_PRICE)}
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Supply (MVP)</div>
                  <div className="text-2xl font-black text-emerald-glow">{TOTAL_SUPPLY.toLocaleString('en-US')} VOD</div>
                  <div className="text-sm text-slate-400 mt-1">Для прототипа интерфейсов и калькуляторов.</div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Live-данные</div>
                  <div className="text-2xl font-black text-gold-glow">
                    {loadingData ? '…' : `${projects.length} проектов`}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {loadingData ? 'Загрузка ресурсов…' : `${resources.length} водных объектов • ${countries} стран`}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  className="px-4 py-2 neo-button rounded-xl font-semibold inline-flex items-center gap-2"
                  href="#staking"
                >
                  <Calculator className="w-4 h-4" />
                  Калькуляторы
                </a>
                <a className="px-4 py-2 glass rounded-xl font-semibold hover:bg-white/5 transition-all" href="#sources">
                  Источники
                </a>
                <Link className="px-4 py-2 glass rounded-xl font-semibold hover:bg-white/5 transition-all" href="/overview">
                  Смотреть презентацию
                </Link>
              </div>
            </Section>

            <Section id="ecosystem" icon={Globe} title="Экосистема" subtitle="Участники, роли, ценность, SDG/ESG-рамки.">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-2">Кому помогает</div>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li>
                      <span className="font-semibold">Государствам</span>: мониторинг, отчётность, кризисные панели, KPI.
                    </li>
                    <li>
                      <span className="font-semibold">Операторам</span>: паспорта объектов, ТО, предиктивная аналитика.
                    </li>
                    <li>
                      <span className="font-semibold">Инвесторам</span>: проекты, IRR/риски, прозрачность исполнения.
                    </li>
                    <li>
                      <span className="font-semibold">Гражданам</span>: участие, сигналы/инциденты, обучение, вознаграждения.
                    </li>
                    <li>
                      <span className="font-semibold">Науке</span>: доступ к данным, модели, экспертная верификация.
                    </li>
                  </ul>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-2">SDG‑alignment</div>
                  <div className="text-slate-300 text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-glow" /> SDG 6 • Чистая вода и санитария
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-glow" /> SDG 9/11 • Инфраструктура и устойчивые города
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gold-glow" /> SDG 13/16 • Климат и прозрачные институты
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">
                    Подробная формулировка: открой “Экосистема и миссия” в каноне.
                  </div>
                </div>
              </div>
            </Section>

            <Section id="architecture" icon={Layers} title="Архитектура слоёв" subtitle="Физика → данные → доверие → экономика → DAO → обратная связь.">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Globe, title: 'Physical', text: 'Водные объекты и инфраструктура в реальном мире.' },
                  { icon: Database, title: 'Data & IoT', text: 'Сбор телеметрии, стандартизация, валидация, поток.' },
                  { icon: Shield, title: 'Trust', text: 'Неизменяемость, аудит, привязка данных к объектам.' },
                  { icon: Wallet, title: 'Economy', text: 'Стейкинг/пулы/инвестиции, прозрачность эффективности.' },
                  { icon: Landmark, title: 'DAO', text: 'Предложения, голосование, казна, комплаенс.' },
                  { icon: TrendingUp, title: 'Feedback', text: 'Отчётность → изменения → новые данные.' },
                ].map((x, i) => {
                  const Icon = x.icon;
                  return (
                    <div key={i} className="glass p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-cyan-glow" />
                        <div className="font-bold text-white">{x.title}</div>
                      </div>
                      <div className="text-sm text-slate-300">{x.text}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-slate-500">
                Детальная схема и сценарии интерактива — в каноне (спецификация интерактивного WhitePaper).
              </div>
            </Section>

            <Section
              id="data"
              icon={Database}
              title="Данные и доверие (live)"
              subtitle="MVP уже объединяет БД + внешние источники (OSM/USGS/WorldBank) и новости."
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-2">Водные ресурсы</div>
                  <div className="text-sm text-slate-300">
                    {loadingData ? (
                      'Загрузка…'
                    ) : (
                      <>
                        Всего: <span className="font-semibold">{resources.length}</span> • Стран:{' '}
                        <span className="font-semibold">{countries}</span>
                        {avgQuality !== null && (
                          <>
                            {' '}
                            • Среднее качество: <span className="font-semibold">{avgQuality.toFixed(1)}%</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link className="px-3 py-2 glass rounded-xl text-sm font-semibold hover:bg-white/5 transition-all" href="/dashboard">
                      Открыть дашборд
                    </Link>
                    <a
                      className="px-3 py-2 glass rounded-xl text-sm font-semibold hover:bg-white/5 transition-all"
                      href="/api/water-resources?external=true"
                      target="_blank"
                      rel="noreferrer"
                    >
                      API
                    </a>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-2">Новости</div>
                  <div className="text-sm text-slate-300">
                    В MVP есть агрегация источников (UN/Greenpeace/WorldBank/UNESCO/EEA + fallback) и сохранение в БД.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link className="px-3 py-2 glass rounded-xl text-sm font-semibold hover:bg-white/5 transition-all" href="/news">
                      Открыть новости
                    </Link>
                    <a
                      className="px-3 py-2 glass rounded-xl text-sm font-semibold hover:bg-white/5 transition-all"
                      href="/api/news?api=true"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Обновить из API
                    </a>
                  </div>
                </div>
              </div>
            </Section>

            <Section id="economy" icon={Wallet} title="Экономика и TokenHub (MVP)" subtitle="Проекты с IRR + сбор средств + стейкинг.">
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="font-bold text-white">Проекты (live)</div>
                  <Link href="/projects" className="text-sm text-cyan-glow hover:underline inline-flex items-center gap-2">
                    Открыть проекты <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
                {loadingData ? (
                  <div className="text-slate-400">Загрузка…</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {projects.slice(0, 6).map((p) => {
                      const irr = parseNumber(p.irr);
                      const target = parseNumber(p.targetAmount);
                      const current = parseNumber(p.currentAmount) || 0;
                      const progress = target ? clamp((current / target) * 100, 0, 100) : null;
                      return (
                        <Link key={p.id} href={`/projects/${p.slug}`} className="glass p-4 rounded-xl hover:bg-white/5 transition-all">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{p.type}{p.location ? ` • ${p.location}` : ''}</div>
                          <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-slate-400">IRR</span>
                            <span className="font-black text-emerald-glow">{irr !== null ? `${irr}%` : '—'}</span>
                          </div>
                          {progress !== null && (
                            <div className="mt-3">
                              <div className="w-full h-2 glass rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-glow to-emerald-glow" style={{ width: `${progress}%` }} />
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                Собрано: {current.toLocaleString('en-US')} / {target!.toLocaleString('en-US')}
                              </div>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </Section>

            <Section
              id="token"
              icon={LinkIcon}
              title="Токен и фазы"
              subtitle="Каноничная формула: токен — ключ к системе управления водой, эволюционирующий по фазам."
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-2">Честные утверждения</div>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li>Token ≠ ownership of water</li>
                    <li>Token ≠ “обещание доходности”</li>
                    <li>Token = access + participation + governance interface</li>
                  </ul>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-2">Фазы (упрощённо)</div>
                  <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                    <li>Access & Participation</li>
                    <li>Staking & Governance / TokenHub</li>
                    <li>Data Anchoring (верификация → хэш → on-chain)</li>
                    <li>Resource-Linked (смарт-контракты объектов/данных)</li>
                  </ol>
                </div>
              </div>
            </Section>

            <Section
              id="staking"
              icon={Calculator}
              title="Стейкинг и доходность (интерактивно)"
              subtitle="Калькуляторы на базе функций из `src/lib/tokenomics/calculations.ts`."
            >
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-3 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-cyan-glow" /> Покупка токенов
                  </div>
                  <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Сумма (USD)</label>
                  <input
                    type="number"
                    value={buyUsd}
                    min={0}
                    onChange={(e) => setBuyUsd(Number(e.target.value))}
                    className="mt-2 w-full px-3 py-2 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white"
                  />
                  <div className="mt-3 text-sm text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Получите</span>
                      <span className="font-black text-cyan-glow">{formatTokens(purchase.tokens)} VOD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Скидка</span>
                      <span className="font-semibold">{purchase.discount}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Экономия</span>
                      <span className="font-semibold">{formatCurrency(purchase.savings)}</span>
                    </div>
                  </div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-glow" /> Стейкинг
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Срок (мес)</label>
                      <input
                        type="number"
                        value={stakeMonths}
                        min={1}
                        max={60}
                        onChange={(e) => setStakeMonths(Number(e.target.value))}
                        className="mt-2 w-full px-3 py-2 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Тип</label>
                      <select
                        value={stakeType}
                        onChange={(e) => updateStakeType(e.target.value)}
                        className="mt-2 w-full px-3 py-2 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white bg-transparent"
                      >
                        <option value="basic">basic</option>
                        <option value="project">project</option>
                        <option value="research">research</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span>APY</span>
                      <span className="font-black text-emerald-glow">{staking.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Награда/год</span>
                      <span className="font-semibold">{formatTokens(staking.annualRewards)} VOD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Награда/всего</span>
                      <span className="font-semibold">{formatTokens(staking.totalRewards)} VOD</span>
                    </div>
                  </div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-3 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-gold-glow" /> Возврат проекта (IRR)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">IRR (%)</label>
                      <input
                        type="number"
                        value={projectIrr}
                        min={0}
                        max={100}
                        onChange={(e) => setProjectIrr(Number(e.target.value))}
                        className="mt-2 w-full px-3 py-2 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-widest font-bold">Срок (мес)</label>
                      <input
                        type="number"
                        value={projectDuration}
                        min={1}
                        max={120}
                        onChange={(e) => setProjectDuration(Number(e.target.value))}
                        className="mt-2 w-full px-3 py-2 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Инвестиция</span>
                      <span className="font-semibold">{formatTokens(purchase.tokens)} VOD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Итого (модель)</span>
                      <span className="font-black text-gold-glow">{formatTokens(projectReturns.totalReturn)} VOD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI (модель)</span>
                      <span className="font-semibold">{projectReturns.roi}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Примечание: это MVP‑калькуляторы (прототип). Целевая tokenomics v2 описана в каноне и должна быть переключаемым режимом на следующем этапе.
              </div>
            </Section>

            <Section
              id="dao"
              icon={Landmark}
              title="DAO и управление"
              subtitle="В MVP это концептуальный слой; в каноне — процедуры, роли и институциональная версия."
            >
              <div className="glass p-4 rounded-xl text-sm text-slate-300">
                Здесь закладываются: предложения → обсуждение → голосование → исполнение → аудит. В интерактивной версии WhitePaper можно расширить раздел
                шаблонами “proposal lifecycle”, делегированием, весами экспертов и комплаенс‑рамкой.
              </div>
            </Section>

            <Section id="mvp" icon={Database} title="Что уже сделано (MVP)" subtitle="Сопоставление обещаний и факта реализации.">
              <div className="glass p-4 rounded-xl">
                <div className="text-sm text-slate-300 space-y-2">
                  <div>
                    - Реализованы модели: User/Wallet/Transaction/Staking/Project/WaterResource/NewsPost (+ social сущности).
                  </div>
                  <div>- Реализованы API: проекты, ресурсы воды (в т.ч. external), новости (агрегация + сохранение), Telegram auth.</div>
                  <div>- Реализованы калькуляторы tokenomics в коде (цена/скидка/APY/IRR).</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveDoc('mvpMap')}
                    className="px-4 py-2 neo-button rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Открыть карту MVP (канон)
                  </button>
                </div>
              </div>
            </Section>

            <Section id="sources" icon={FileText} title="Источники внутри проекта" subtitle="Каждый тезис должен быть “доказуемым”.">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-2">Канон документов (внутри MVP)</div>
                  <div className="text-sm text-slate-300">
                    Папка: <span className="font-semibold">`vod-eco-mvp/docs/VODeco_Canon`</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {(Object.keys(CANON_DOCS) as DocKey[]).map((key) => {
                      const d = CANON_DOCS[key];
                      return (
                        <div key={key} className="flex items-center justify-between gap-3">
                          <button onClick={() => setActiveDoc(key)} className="text-left text-sm text-cyan-glow hover:underline">
                            {d.title}
                          </button>
                          <a
                            className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1"
                            href={`/api/docs?file=${encodeURIComponent(d.file)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Raw <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="font-bold text-white mb-2">Ссылки на API (для интерактивов)</div>
                  <div className="text-sm text-slate-300 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span>/api/projects</span>
                      <a className="text-cyan-glow hover:underline" href="/api/projects" target="_blank" rel="noreferrer">
                        открыть <ExternalLink className="inline w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>/api/water-resources?external=true</span>
                      <a className="text-cyan-glow hover:underline" href="/api/water-resources?external=true" target="_blank" rel="noreferrer">
                        открыть <ExternalLink className="inline w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>/api/news</span>
                      <a className="text-cyan-glow hover:underline" href="/api/news" target="_blank" rel="noreferrer">
                        открыть <ExternalLink className="inline w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </main>
        </div>
      </div>

      <DocModal
        open={activeDoc !== null}
        onClose={() => setActiveDoc(null)}
        title={activeDoc ? CANON_DOCS[activeDoc].title : ''}
        file={activeDoc ? CANON_DOCS[activeDoc].file : ''}
      />
    </div>
  );
}

