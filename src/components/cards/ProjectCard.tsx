'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, TrendingUp, MapPin, ArrowRight, Clock, Users } from 'lucide-react';
import { formatNumber } from '@/lib/utils/format';

export interface ProjectCardData {
  id: string;
  slug?: string;
  name: string;
  description: string;
  type: string;
  location?: string;
  irr?: number;
  targetAmount?: string;
  currentAmount?: string;
  progress?: number;
  status?: 'draft' | 'active' | 'completed' | 'archived';
  metadata?: string | Record<string, any>;
  imageUrl?: string;
  participants?: number;
  deadline?: string;
}

interface ProjectCardProps {
  project: ProjectCardData;
  index?: number;
  variant?: 'default' | 'compact' | 'detailed';
  onClick?: () => void;
  showProgress?: boolean;
  showLocation?: boolean;
  className?: string;
}

const statusColors = {
  draft: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  active: 'bg-cyan-glow/20 text-cyan-glow border-cyan-glow/50',
  completed: 'bg-emerald-glow/20 text-emerald-glow border-emerald-glow/50',
  archived: 'bg-slate-600/20 text-slate-500 border-slate-600/50',
};

const typeColors: Record<string, string> = {
  'P-VOD': 'bg-purple-glow/20 text-purple-glow border-purple-glow/50',
  'R-VOD': 'bg-emerald-glow/20 text-emerald-glow border-emerald-glow/50',
  'O-VOD': 'bg-cyan-glow/20 text-cyan-glow border-cyan-glow/50',
  'Mega-Project': 'bg-gold-glow/20 text-gold-glow border-gold-glow/50',
};

export default function ProjectCard({
  project,
  index = 0,
  variant = 'default',
  onClick,
  showProgress = true,
  showLocation = true,
  className = '',
}: ProjectCardProps) {
  const progress = project.progress ?? (project.targetAmount && project.currentAmount
    ? (parseFloat(project.currentAmount) / parseFloat(project.targetAmount)) * 100
    : 0);

  const status = project.status || 'active';
  const typeColor = typeColors[project.type] || 'bg-white/10 text-white/70 border-white/20';

  // Parse metadata
  let metadata: Record<string, any> = {};
  if (project.metadata) {
    try {
      metadata = typeof project.metadata === 'string' 
        ? JSON.parse(project.metadata) 
        : project.metadata;
    } catch (e) {
      // Ignore parse errors
    }
  }

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card hover:bg-white/10 transition-all cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Project Image or Icon */}
      {project.imageUrl ? (
        <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gradient-to-br from-cyan-glow/20 to-purple-glow/20">
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-cyan-glow/20 to-purple-glow/20 rounded-lg mb-4 flex items-center justify-center">
          <Briefcase className="w-16 h-16 text-white/20" />
        </div>
      )}

      {/* Project Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColor}`}>
              {project.type}
            </span>
            {status && (
              <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[status]}`}>
                {status}
              </span>
            )}
            {metadata?.source && (
              <span className="px-2 py-1 rounded-full text-xs border bg-white/10 text-white/70">
                {metadata.source}
              </span>
            )}
          </div>
          {project.irr && (
            <div className="flex items-center gap-1 text-emerald-glow">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">{project.irr}%</span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-glow transition-colors line-clamp-2">
          {project.name}
        </h3>
        {variant !== 'compact' && (
          <p className="text-white/70 text-sm line-clamp-2">{project.description}</p>
        )}
      </div>

      {/* Progress */}
      {showProgress && project.targetAmount && (
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
              className="h-full bg-gradient-to-r from-cyan-glow to-emerald-glow"
            />
          </div>
          <div className="flex justify-between text-xs mt-2 text-white/60">
            <span>{formatNumber(project.currentAmount || '0')} VOD</span>
            <span>{formatNumber(project.targetAmount)} VOD</span>
          </div>
        </div>
      )}

      {/* Additional Info */}
      {variant === 'detailed' && (
        <div className="mb-4 space-y-2">
          {project.participants && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Users className="w-4 h-4" />
              <span>{project.participants} участников</span>
            </div>
          )}
          {project.deadline && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="w-4 h-4" />
              <span>{project.deadline}</span>
            </div>
          )}
        </div>
      )}

      {/* Location */}
      {showLocation && project.location && (
        <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{project.location}</span>
        </div>
      )}

      {/* CTA */}
      {variant !== 'compact' && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm text-white/60">View Details</span>
          <ArrowRight className="w-5 h-5 text-cyan-glow group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </motion.div>
  );

  if (project.slug && !onClick) {
    return (
      <Link href={`/projects/${project.slug}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
