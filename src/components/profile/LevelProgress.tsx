'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { getXPForNextLevel } from '@/lib/tokenomics/rewards';

interface LevelProgressProps {
  level: number;
  experience: number;
}

export default function LevelProgress({ level, experience }: LevelProgressProps) {
  const xpForNext = getXPForNextLevel(experience);
  const currentLevelXP = experience - (level > 1 ? 100 * Math.pow(2, level - 2) : 0);
  const nextLevelXP = xpForNext;
  const progress = nextLevelXP > 0 ? (currentLevelXP / (currentLevelXP + nextLevelXP)) * 100 : 100;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">Level {level}</div>
            <div className="text-sm text-slate-400">Experience Points</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-glow">{experience.toLocaleString()}</div>
          <div className="text-xs text-slate-500">Total XP</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Progress to Level {level + 1}</span>
          <span>{xpForNext > 0 ? `${xpForNext} XP needed` : 'Max Level'}</span>
        </div>
        <div className="w-full h-3 glass rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-glow to-blue-500"
          />
        </div>
      </div>

      {/* Level Benefits */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <TrendingUp className="w-4 h-4" />
        <span>
          Level {level} benefits: +{Math.min(level * 0.5, 5).toFixed(1)}% staking APY bonus
          {level >= 5 && ', Priority Support'}
        </span>
      </div>
    </div>
  );
}
