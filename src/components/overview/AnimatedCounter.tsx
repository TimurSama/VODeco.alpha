'use client';

import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  onComplete,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      },
    });

    return () => controls.stop();
  }, [value, duration, onComplete]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      {suffix}
    </motion.span>
  );
}
