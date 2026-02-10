'use client';

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'circle' | 'list' | 'grid';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ type = 'card', count = 1, className = '' }: SkeletonLoaderProps) {
  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 ${className}`}
          >
            <div className="skeleton h-48 rounded-xl mb-4" />
            <div className="skeleton h-4 w-3/4 rounded mb-2" />
            <div className="skeleton h-4 w-1/2 rounded mb-4" />
            <div className="skeleton h-2 w-full rounded" />
          </motion.div>
        ))}
      </>
    );
  }

  if (type === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-4 rounded" style={{ width: `${100 - i * 10}%` }} />
        ))}
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div className={`skeleton rounded-full ${className}`} style={{ width: className.includes('w-') ? undefined : '48px', height: className.includes('h-') ? undefined : '48px' }} />
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton rounded-full w-10 h-10" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="skeleton h-48 rounded-xl mb-4" />
            <div className="skeleton h-4 w-3/4 rounded mb-2" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
