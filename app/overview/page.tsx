'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OverviewScreen1 from '@/components/overview/OverviewScreen1';
import OverviewScreen2 from '@/components/overview/OverviewScreen2';
import OverviewScreen3 from '@/components/overview/OverviewScreen3';
import OverviewScreen4 from '@/components/overview/OverviewScreen4';
import OverviewScreen5 from '@/components/overview/OverviewScreen5';
import OverviewScreen6 from '@/components/overview/OverviewScreen6';
import OverviewScreen7 from '@/components/overview/OverviewScreen7';
import OverviewScreen8 from '@/components/overview/OverviewScreen8';
import OverviewScreen9 from '@/components/overview/OverviewScreen9';
import { fetchWaterResources, WaterResource } from '@/lib/api/water-resources';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function OverviewPage() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [waterResources, setWaterResources] = useState<WaterResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resources = await fetchWaterResources({ external: true });
        setWaterResources(resources);
      } catch (error) {
        console.error('Failed to load water resources:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalScreens = 9;

  const handleNext = () => {
    if (currentScreen < totalScreens) {
      setCurrentScreen(currentScreen + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-ocean-deep">
        <LoadingSpinner />
      </div>
    );
  }

              return (
    <div className="min-h-screen bg-ocean-deep relative">
      <AnimatePresence mode="wait">
        {currentScreen === 1 && (
          <OverviewScreen1
            key="screen1"
            onNext={handleNext}
            waterResources={waterResources}
          />
        )}
        {currentScreen === 2 && (
          <OverviewScreen2
            key="screen2"
            onNext={handleNext}
            onPrev={handlePrev}
            waterResources={waterResources}
          />
        )}
        {currentScreen === 3 && (
          <OverviewScreen3
            key="screen3"
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentScreen === 4 && (
          <OverviewScreen4
            key="screen4"
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentScreen === 5 && (
          <OverviewScreen5
            key="screen5"
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentScreen === 6 && (
          <OverviewScreen6
            key="screen6"
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentScreen === 7 && (
          <OverviewScreen7
            key="screen7"
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentScreen === 8 && (
          <OverviewScreen8
            key="screen8"
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentScreen === 9 && (
          <OverviewScreen9
            key="screen9"
            onNext={() => setCurrentScreen(1)}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="glass-card px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 md:gap-4">
          <button
            onClick={handlePrev}
            disabled={currentScreen === 1}
            className="p-2 neo-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 md:gap-2 flex-1 justify-center">
            {Array.from({ length: totalScreens }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentScreen(idx + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`h-2 rounded-full transition-all ${
                  currentScreen === idx + 1
                    ? 'bg-cyan-glow w-6 md:w-8'
                    : 'bg-white/30 hover:bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentScreen === totalScreens}
            className="p-2 neo-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
                </button>
              </div>
                </div>
    </div>
  );
}
