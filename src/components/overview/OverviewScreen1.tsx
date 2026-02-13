'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Droplets } from 'lucide-react';
import Globe3D from '@/components/globe/Globe3D';
import { WaterResource } from '@/lib/api/water-resources';

interface OverviewScreen1Props {
  onNext: () => void;
  waterResources: WaterResource[];
}

export default function OverviewScreen1({ onNext, waterResources }: OverviewScreen1Props) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ocean-deep">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/10 via-transparent to-purple-glow/10" />
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 gradient-text">
                VODeco
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
                Децентрализованная экосистема управления водными ресурсами
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-white/80 leading-relaxed"
            >
              Токенизация участия и демократизация управления водными активами через интеграцию IoT, AI и Blockchain для обеспечения прозрачности и устойчивости.
            </motion.p>

            {/* SDG Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {['SDG 6', 'SDG 9', 'SDG 11', 'SDG 13', 'SDG 16'].map((sdg, idx) => (
                <span
                  key={sdg}
                  className="px-4 py-2 glass rounded-full text-sm font-semibold text-cyan-glow border border-cyan-glow/30 hover:bg-cyan-glow/10 transition-colors cursor-pointer"
                >
                  {sdg}
                </span>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={onNext}
              className="group flex items-center gap-3 px-8 py-4 neo-button rounded-xl text-lg font-bold text-white hover:scale-105 transition-all"
            >
              <span>Изучить проект</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right: Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] relative">
              <div className="absolute inset-0 neo-card rounded-2xl overflow-hidden">
                <Globe3D
                  waterResources={waterResources}
                  onResourceClick={() => {}}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-glow/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-glow/20 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
