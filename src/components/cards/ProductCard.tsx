'use client';

import { motion } from 'framer-motion';
import { Package, DollarSign, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export interface ProductCardData {
  id: string;
  name: string;
  description: string;
  type: 'IoT' | 'Software' | 'Hardware' | 'Service' | 'Platform';
  status: 'development' | 'prototype' | 'pilot' | 'production';
  cost?: string;
  developmentTime?: string;
  features?: string[];
  imageUrl?: string;
  link?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
  variant?: 'default' | 'compact';
  onClick?: () => void;
  className?: string;
}

const typeColors: Record<string, string> = {
  IoT: 'bg-cyan-glow/20 text-cyan-glow border-cyan-glow/50',
  Software: 'bg-purple-glow/20 text-purple-glow border-purple-glow/50',
  Hardware: 'bg-gold-glow/20 text-gold-glow border-gold-glow/50',
  Service: 'bg-emerald-glow/20 text-emerald-glow border-emerald-glow/50',
  Platform: 'bg-rose-glow/20 text-rose-glow border-rose-glow/50',
};

const statusLabels: Record<string, string> = {
  development: 'В разработке',
  prototype: 'Прототип',
  pilot: 'Пилот',
  production: 'В продакшене',
};

export default function ProductCard({
  product,
  index = 0,
  variant = 'default',
  onClick,
  className = '',
}: ProductCardProps) {
  const typeColor = typeColors[product.type] || 'bg-white/10 text-white/70 border-white/20';

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card hover:bg-white/10 transition-all cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Product Image or Icon */}
      {product.imageUrl ? (
        <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gradient-to-br from-cyan-glow/20 to-purple-glow/20">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-cyan-glow/20 to-purple-glow/20 rounded-lg mb-4 flex items-center justify-center">
          <Package className="w-16 h-16 text-white/20" />
        </div>
      )}

      {/* Product Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColor}`}>
              {product.type}
            </span>
            <span className="px-2 py-1 rounded-full text-xs border bg-white/10 text-white/70">
              {statusLabels[product.status]}
            </span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-glow transition-colors line-clamp-2">
          {product.name}
        </h3>
        {variant !== 'compact' && (
          <p className="text-white/70 text-sm line-clamp-2">{product.description}</p>
        )}
      </div>

      {/* Features */}
      {variant !== 'compact' && product.features && product.features.length > 0 && (
        <div className="mb-4 space-y-1">
          {product.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-white/60">
              <CheckCircle className="w-4 h-4 text-emerald-glow" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Cost and Time */}
      {variant !== 'compact' && (
        <div className="mb-4 space-y-2">
          {product.cost && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <DollarSign className="w-4 h-4" />
              <span>{product.cost}</span>
            </div>
          )}
          {product.developmentTime && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="w-4 h-4" />
              <span>{product.developmentTime}</span>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      {variant !== 'compact' && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm text-white/60">Подробнее</span>
          <ArrowRight className="w-5 h-5 text-cyan-glow group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </motion.div>
  );

  if (product.link && !onClick) {
    return (
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
