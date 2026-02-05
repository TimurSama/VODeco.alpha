'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Globe3D from '@/components/globe/Globe3D';
import MetricsPanel from '@/components/dashboard/MetricsPanel';
import ResourceInfoPanel from '@/components/dashboard/ResourceInfoPanel';
import { fetchWaterResources, WaterResource } from '@/lib/api/water-resources';
import { fetchEnhancedWaterData, calculateQualityTrends } from '@/lib/api/enhanced-water-data';
import { fetchWorldBankWaterData } from '@/lib/api/world-bank-api';
import { Filter, Search, X, MapPin, Droplets, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { trackEvent } from '@/lib/analytics';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [waterResources, setWaterResources] = useState<WaterResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<WaterResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: [] as string[],
    category: [] as string[],
    country: '',
    minQuality: 0,
  });
  const [enhancedMetrics, setEnhancedMetrics] = useState<any>(null);
  const [qualityTrends, setQualityTrends] = useState<any[]>([]);
  const [includeExternal, setIncludeExternal] = useState(true);
  const [externalStats, setExternalStats] = useState({ osm: 0, usgs: 0, worldBank: 0 });

  useEffect(() => {
    loadWaterResources();
  }, [filters, includeExternal]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const handle = setTimeout(() => {
      if (searchQuery.trim().length < 3) return;
      trackEvent('dashboard_search', { queryLength: searchQuery.trim().length });
    }, 500);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const loadWaterResources = async () => {
    setLoading(true);
    try {
      const dbResources = await fetchWaterResources({
        type: filters.type.length > 0 ? filters.type : undefined,
        category: filters.category.length > 0 ? filters.category : undefined,
        country: filters.country || undefined,
        minQuality: filters.minQuality > 0 ? filters.minQuality : undefined,
        includeExternal,
      });
      setWaterResources(dbResources);
      
      // Metrics based on already loaded resources
      const enhanced = await fetchEnhancedWaterData(dbResources, false);
      setEnhancedMetrics(enhanced.metrics);
      setQualityTrends(calculateQualityTrends(dbResources, 'week'));
      let worldBankCount = 0;
      if (includeExternal) {
        try {
          const worldBankData = await fetchWorldBankWaterData();
          worldBankCount = worldBankData.length;
        } catch (error) {
          console.warn('World Bank data unavailable:', error);
        }
        const externalCounts = dbResources.reduce(
          (acc, resource) => {
            const metadata = typeof resource.metadata === 'string'
              ? (() => {
                  try {
                    return JSON.parse(resource.metadata);
                  } catch {
                    return null;
                  }
                })()
              : resource.metadata;
            if (metadata?.external) {
              const source = String(metadata?.source || '').toLowerCase();
              if (source.includes('openstreetmap')) acc.osm += 1;
              else if (source.includes('usgs')) acc.usgs += 1;
              else if (source.includes('world bank')) acc.worldBank += 1;
            }
            return acc;
          },
          { osm: 0, usgs: 0, worldBank: 0 }
        );
        setExternalStats({ ...externalCounts, worldBank: externalCounts.worldBank + worldBankCount });
        trackEvent('dashboard_load', {
          resources: dbResources.length,
          includeExternal,
          osm: externalCounts.osm,
          usgs: externalCounts.usgs,
          worldBank: externalCounts.worldBank + worldBankCount,
        });
      } else {
        setExternalStats({ osm: 0, usgs: 0, worldBank: 0 });
        trackEvent('dashboard_load', {
          resources: dbResources.length,
          includeExternal,
          osm: 0,
          usgs: 0,
          worldBank: 0,
        });
      }
    } catch (error) {
      console.error('Error loading water resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = waterResources.filter(resource => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        resource.name.toLowerCase().includes(query) ||
        resource.country?.toLowerCase().includes(query) ||
        resource.region?.toLowerCase().includes(query) ||
        resource.type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const toggleFilter = (type: 'type' | 'category', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value],
    }));
    trackEvent('dashboard_filter_toggle', { filterType: type, value });
  };

  const selectResource = (resource: WaterResource) => {
    setSelectedResource(resource);
    trackEvent('dashboard_resource_open', {
      resourceId: resource.id,
      type: resource.type,
      category: resource.category,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-deep flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-deep">
      {/* Header Section */}
      <div className="sticky top-16 z-30 glass border-b border-white/10 mb-4">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full md:max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('dashboard.quickSearch')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl border border-white/10 hover:bg-white/5 transition-all"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">{t('dashboard.filters')}</span>
              {Object.values(filters).some(v => (Array.isArray(v) ? v.length > 0 : v)) && (
                <span className="w-2 h-2 bg-cyan-glow rounded-full"></span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">
                      {t('dashboard.selectType')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['river', 'lake', 'sea', 'ocean', 'glacier', 'underground', 'station', 'treatment', 'organization'].map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleFilter('type', type)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            filters.type.includes(type)
                              ? 'bg-cyan-glow text-white'
                              : 'glass text-slate-400 hover:bg-white/5'
                          }`}
                        >
                          {t(`dashboard.${type}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">
                      {t('dashboard.category')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['source', 'object', 'subject'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleFilter('category', cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            filters.category.includes(cat)
                              ? 'bg-emerald-glow text-white'
                              : 'glass text-slate-400 hover:bg-white/5'
                          }`}
                        >
                          {t(`dashboard.${cat}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Filter */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-300">
                      {t('dashboard.minQuality')} ({filters.minQuality}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minQuality}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFilters(prev => ({ ...prev, minQuality: value }));
                    trackEvent('dashboard_quality_filter', { value });
                  }}
                      className="w-full"
                    />
                  </div>
                </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={includeExternal}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setIncludeExternal(next);
                    trackEvent('dashboard_external_toggle', { enabled: next });
                  }}
                  className="accent-cyan-400"
                />
                Подключать внешние источники (OSM/USGS/World Bank)
              </label>
            </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilters({ type: [], category: [], country: '', minQuality: 0 });
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 glass rounded-lg text-sm font-semibold hover:bg-white/5 transition-all"
                >
                  {t('common.clear')} {t('dashboard.filters')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* WhitePaper Callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-card p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Документация</div>
            <div className="text-white font-black text-lg">Интерактивный WhitePaper уже в MVP</div>
            <div className="text-slate-400 text-sm">
              Слои экосистемы, механики, калькуляторы, live-данные и источники из канона.
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/whitepaper" className="px-4 py-2 neo-button rounded-xl font-semibold">
              Открыть WhitePaper
            </Link>
            <Link href="/overview" className="px-4 py-2 glass rounded-xl font-semibold hover:bg-white/5 transition-all">
              Презентация
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Metrics Sidebar - Mobile First: Hidden on small screens, shown on lg+ */}
          <div className="hidden lg:block lg:col-span-1">
            <MetricsPanel 
              metrics={enhancedMetrics ? [
                {
                  label: t('dashboard.globalMetrics'),
                  value: enhancedMetrics.totalResources.toString(),
                  change: '+8%',
                  icon: Droplets,
                  color: 'text-cyan-glow',
                  glowColor: 'shadow-cyan-glow/20',
                },
                {
                  label: t('dashboard.ecologicalIndicators'),
                  value: `${enhancedMetrics.averageQuality.toFixed(1)}%`,
                  change: '+3%',
                  icon: TrendingUp,
                  color: 'text-emerald-glow',
                  glowColor: 'shadow-emerald-glow/20',
                },
                {
                  label: t('dashboard.economicIndices'),
                  value: enhancedMetrics.countries.toString(),
                  change: '+2',
                  icon: MapPin,
                  color: 'text-gold-glow',
                  glowColor: 'shadow-gold-glow/20',
                },
                {
                  label: 'Quality Distribution',
                  value: `${enhancedMetrics.qualityDistribution.excellent}`,
                  change: 'Excellent',
                  icon: BarChart3,
                  color: 'text-purple-glow',
                  glowColor: 'shadow-purple-glow/20',
                },
              ] : undefined}
            />

            {/* External Sources Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neo-card p-4 mt-4"
            >
              <h4 className="text-sm font-bold text-white mb-3">Источники данных</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>OpenStreetMap</span>
                  <span className="text-cyan-glow">{externalStats.osm}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>USGS</span>
                  <span className="text-cyan-glow">{externalStats.usgs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>World Bank</span>
                  <span className="text-cyan-glow">{externalStats.worldBank}</span>
                </div>
              </div>
            </motion.div>
            
            {/* Quality Trends Chart */}
            {qualityTrends.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="neo-card p-4 mt-4"
              >
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-glow" />
                  Quality Trends (Week)
                </h4>
                <div className="space-y-2">
                  {qualityTrends.slice(-7).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{trend.period}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 glass rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${trend.averageQuality}%` }}
                            transition={{ delay: index * 0.1 }}
                            className={`h-full ${
                              trend.averageQuality > 70 ? 'bg-emerald-glow' :
                              trend.averageQuality > 40 ? 'bg-gold-glow' : 'bg-rose-glow'
                            }`}
                          />
                        </div>
                        <span className="text-xs font-bold text-white w-12 text-right">
                          {trend.averageQuality.toFixed(0)}%
                        </span>
                        {trend.change !== 0 && (
                          trend.change > 0 ? (
                            <TrendingUp className="w-3 h-3 text-emerald-glow" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-rose-glow" />
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Globe Section */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neo-card overflow-hidden"
              style={{ height: '600px', minHeight: '400px' }}
            >
              <Globe3D 
                waterResources={filteredResources} 
                onResourceClick={selectResource} 
              />
            </motion.div>
            {filteredResources.length === 0 && (
              <div className="mt-4 glass-card p-4 text-center text-slate-400">
                Нет ресурсов по текущим фильтрам. Попробуйте сбросить фильтры.
              </div>
            )}

            {/* Resource Stats - Mobile */}
            <div className="lg:hidden mt-4 grid grid-cols-2 gap-4">
              <div className="glass-card text-center">
                <Droplets className="w-8 h-8 text-cyan-glow mx-auto mb-2" />
                <div className="text-2xl font-black text-cyan-glow">{filteredResources.length}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Resources</div>
              </div>
              <div className="glass-card text-center">
                <MapPin className="w-8 h-8 text-emerald-glow mx-auto mb-2" />
                <div className="text-2xl font-black text-emerald-glow">
                  {new Set(filteredResources.map(r => r.country).filter(Boolean)).size}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Details Panel */}
        <AnimatePresence>
          {selectedResource && (
            <ResourceInfoPanel
              resource={selectedResource}
              onClose={() => setSelectedResource(null)}
            />
          )}
        </AnimatePresence>

        {/* Resources List - Mobile View */}
        <div className="lg:hidden mt-6 space-y-3">
          <h3 className="text-lg font-bold text-white mb-4">
            {t('dashboard.waterResources')} ({filteredResources.length})
          </h3>
          {filteredResources.slice(0, 5).map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => selectResource(resource)}
              className="glass-card cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{resource.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="uppercase">{resource.type}</span>
                    {resource.country && (
                      <>
                        <span>•</span>
                        <span>{resource.country}</span>
                      </>
                    )}
                  </div>
                </div>
                {resource.qualityIndex !== undefined && (
                  <div className="text-right">
                    <div className={`text-lg font-black ${
                      resource.qualityIndex > 70 ? 'text-emerald-glow' :
                      resource.qualityIndex > 40 ? 'text-gold-glow' : 'text-rose-glow'
                    }`}>
                      {resource.qualityIndex}%
                    </div>
                    <div className="text-xs text-slate-500">Quality</div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
