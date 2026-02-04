'use client';

import { motion } from 'framer-motion';
import { Award, Calendar } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category: string;
  points: number;
  earnedAt: string;
}

interface AchievementFeedProps {
  achievements: Achievement[];
}

export default function AchievementFeed({ achievements }: AchievementFeedProps) {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No achievements yet</p>
        <p className="text-slate-500 text-sm mt-2">
          Complete missions and activities to earn achievements
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-4 flex items-start gap-4 hover:bg-white/5 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center flex-shrink-0">
            {achievement.icon ? (
              <span className="text-2xl">{achievement.icon}</span>
            ) : (
              <Award className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
            <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>{achievement.points} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(achievement.earnedAt).toLocaleDateString()}</span>
              </div>
              <span className="px-2 py-1 glass rounded text-[10px] font-semibold">
                {achievement.category}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
