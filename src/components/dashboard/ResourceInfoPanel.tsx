'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Droplets, Activity, TrendingUp, Globe, Gauge } from 'lucide-react';
import { WaterResource } from '@/lib/api/water-resources';
import { useLanguage } from '@/lib/i18n/context';

interface ResourceInfoPanelProps {
  resource: WaterResource | null;
  onClose: () => void;
}

export default function ResourceInfoPanel({ resource, onClose }: ResourceInfoPanelProps) {
  const { t } = useLanguage();
  
  if (!resource) return null;

  const getQualityColor = (quality?: number) => {
    if (!quality) return 'text-slate-400';
    if (quality > 70) return 'text-emerald-glow';
    if (quality > 40) return 'text-gold-glow';
    return 'text-rose-glow';
  };

  const getQualityLabel = (quality?: number) => {
    if (!quality) return 'N/A';
    if (quality > 70) return 'Excellent';
    if (quality > 40) return 'Good';
    return 'Poor';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="neo-card p-6 mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">{resource.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider">
              <span className="px-2 py-1 glass rounded-lg">{resource.type}</span>
              <span className="px-2 py-1 glass rounded-lg">{resource.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 neo-button rounded-xl hover:bg-white/5 transition-colors active:scale-95"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {resource.country && (
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <div className="p-2 bg-cyan-glow/20 rounded-lg">
                <MapPin className="w-5 h-5 text-cyan-glow" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  {t('common.location')}
                </p>
                <p className="font-bold text-white">{resource.country}</p>
                {resource.region && (
                  <p className="text-sm text-slate-400">{resource.region}</p>
                )}
              </div>
            </div>
          )}

          {resource.qualityIndex !== undefined && (
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <div className="p-2 bg-emerald-glow/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-glow" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  {t('dashboard.qualityIndex')}
                </p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-black ${getQualityColor(resource.qualityIndex)}`}>
                    {resource.qualityIndex}%
                  </p>
                  <span className={`text-xs font-bold ${getQualityColor(resource.qualityIndex)}`}>
                    {getQualityLabel(resource.qualityIndex)}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${resource.qualityIndex}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${
                      resource.qualityIndex > 70 ? 'bg-emerald-glow' :
                      resource.qualityIndex > 40 ? 'bg-gold-glow' : 'bg-rose-glow'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {resource.flowRate !== undefined && (
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Gauge className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Flow Rate
                </p>
                <p className="font-bold text-white">{resource.flowRate} m³/s</p>
              </div>
            </div>
          )}

          {resource.capacity !== undefined && (
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Droplets className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Capacity
                </p>
                <p className="font-bold text-white">{resource.capacity} m³</p>
              </div>
            </div>
          )}
        </div>

        {resource.description && (
          <div className="mb-6 p-4 glass rounded-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
              {t('common.description')}
            </p>
            <p className="text-white/90 leading-relaxed">{resource.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-3 neo-button rounded-xl font-bold text-white hover:bg-white/5 transition-all active:scale-95">
            View on Map
          </button>
          <button className="flex-1 px-4 py-3 bg-cyan-glow text-white rounded-xl font-bold hover:bg-cyan-glow/80 transition-all active:scale-95 shadow-lg shadow-cyan-glow/20">
            View Details
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
