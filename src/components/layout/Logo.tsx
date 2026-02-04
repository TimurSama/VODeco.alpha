'use client';

import React from 'react';
import { Droplets } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 group">
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-glow/30 group-hover:scale-110 transition-transform">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 rounded-xl bg-cyan-glow/20 blur-xl group-hover:bg-cyan-glow/30 transition-colors" />
      </div>
      <span className="text-xl font-black tracking-tighter text-glow-cyan hidden sm:block">
        VODeco
      </span>
    </div>
  );
}
