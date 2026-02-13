'use client';

import { motion } from 'framer-motion';
import { BookOpen, User, Calendar, ArrowRight, FileText, Award } from 'lucide-react';

export interface ResearchCardData {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'study' | 'report' | 'publication' | 'thesis';
  author?: string;
  date?: string;
  tags?: string[];
  imageUrl?: string;
  link?: string;
  verified?: boolean;
  citations?: number;
}

interface ResearchCardProps {
  research: ResearchCardData;
  index?: number;
  variant?: 'default' | 'compact';
  onClick?: () => void;
  className?: string;
}

const typeColors: Record<string, string> = {
  article: 'bg-cyan-glow/20 text-cyan-glow border-cyan-glow/50',
  study: 'bg-emerald-glow/20 text-emerald-glow border-emerald-glow/50',
  report: 'bg-purple-glow/20 text-purple-glow border-purple-glow/50',
  publication: 'bg-gold-glow/20 text-gold-glow border-gold-glow/50',
  thesis: 'bg-rose-glow/20 text-rose-glow border-rose-glow/50',
};

export default function ResearchCard({
  research,
  index = 0,
  variant = 'default',
  onClick,
  className = '',
}: ResearchCardProps) {
  const typeColor = typeColors[research.type] || 'bg-white/10 text-white/70 border-white/20';

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card hover:bg-white/10 transition-all cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Research Image or Icon */}
      {research.imageUrl ? (
        <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gradient-to-br from-cyan-glow/20 to-purple-glow/20">
          <img
            src={research.imageUrl}
            alt={research.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-cyan-glow/20 to-purple-glow/20 rounded-lg mb-4 flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-white/20" />
        </div>
      )}

      {/* Research Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColor}`}>
              {research.type}
            </span>
            {research.verified && (
              <span className="px-2 py-1 rounded-full text-xs border bg-emerald-glow/20 text-emerald-glow">
                Verified
              </span>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-glow transition-colors line-clamp-2">
          {research.title}
        </h3>
        {variant !== 'compact' && (
          <p className="text-white/70 text-sm line-clamp-2">{research.description}</p>
        )}
      </div>

      {/* Author and Date */}
      {variant !== 'compact' && (
        <div className="mb-4 space-y-2">
          {research.author && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <User className="w-4 h-4" />
              <span>{research.author}</span>
            </div>
          )}
          {research.date && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="w-4 h-4" />
              <span>{research.date}</span>
            </div>
          )}
          {research.citations !== undefined && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Award className="w-4 h-4" />
              <span>{research.citations} цитирований</span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {variant !== 'compact' && research.tags && research.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {research.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-full text-xs bg-white/5 text-white/70 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      {variant !== 'compact' && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm text-white/60">Читать</span>
          <ArrowRight className="w-5 h-5 text-cyan-glow group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </motion.div>
  );

  if (research.link && !onClick) {
    return (
      <a href={research.link} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
