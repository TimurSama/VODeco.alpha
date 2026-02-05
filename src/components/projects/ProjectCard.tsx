'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
import { Project } from '@/lib/api/projects';
import { formatNumber } from '@/lib/utils/format';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const progress = project.targetAmount
    ? (parseFloat(project.currentAmount) / parseFloat(project.targetAmount)) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card hover:bg-white/10 transition-all cursor-pointer group"
    >
      <Link href={`/projects/${project.slug}`}>
        {/* Project Image */}
        <div className="w-full h-48 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-lg mb-4 flex items-center justify-center">
          <Briefcase className="w-16 h-16 text-white/20" />
        </div>

        {/* Project Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 glass rounded-full text-xs capitalize">
                {project.type}
              </span>
              {/* Source Badge */}
              {project.metadata && (() => {
                try {
                  const meta =
                    typeof project.metadata === 'string'
                      ? JSON.parse(project.metadata)
                      : project.metadata;
                  if (meta?.source) {
                    const sourceColors: Record<string, string> = {
                      'VOD Team': 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
                      'Uzbekistan': 'bg-neon-green/20 text-neon-green border-neon-green/50',
                      'Web': 'bg-neon-purple/20 text-neon-purple border-neon-purple/50',
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs border ${sourceColors[meta.source] || 'bg-white/10 text-white/70'}`}>
                        {meta.source}
                      </span>
                    );
                  }
                } catch (e) {
                  // Ignore parse errors
                }
                return null;
              })()}
            </div>
            {project.irr && (
              <div className="flex items-center gap-1 text-neon-green">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{project.irr}%</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">
            {project.name}
          </h3>
          <p className="text-white/70 text-sm line-clamp-2">{project.description}</p>
        </div>

        {/* Progress */}
        {project.targetAmount && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Funded</span>
              <span className="font-semibold">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 glass rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-green"
              />
            </div>
            <div className="flex justify-between text-xs mt-2 text-white/60">
              <span>{formatNumber(project.currentAmount)} VOD</span>
              <span>{formatNumber(project.targetAmount)} VOD</span>
            </div>
          </div>
        )}

        {/* Location */}
        {project.location && (
          <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{project.location}</span>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm text-white/60">View Details</span>
          <ArrowRight className="w-5 h-5 text-neon-cyan group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}
