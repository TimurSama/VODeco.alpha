'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Earth from './Earth';
import MapView from './MapView';
import { WaterResource } from '@/lib/api/water-resources';
import { Globe, Satellite, Activity, Zap, Map, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Globe3DProps {
  waterResources: WaterResource[];
  onResourceClick: (resource: WaterResource) => void;
}

type ViewMode = 'standard' | 'satellite' | 'ecology' | 'infrastructure';
type ViewType = 'globe' | 'map';

// Component to track camera distance
function CameraController({ 
  onZoomChange, 
  onViewTypeChange 
}: { 
  onZoomChange: (distance: number) => void;
  onViewTypeChange: (type: ViewType) => void;
}) {
  const { camera } = useThree();
  const prevDistance = useRef(5.5);
  const prevViewType = useRef<ViewType>('globe');

  useFrame(() => {
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    
    if (Math.abs(distance - prevDistance.current) > 0.1) {
      onZoomChange(distance);
      
      // Transition to map view when zoomed in close (distance < 3.5)
      if (distance < 3.5 && prevDistance.current >= 3.5) {
        if (prevViewType.current !== 'map') {
          onViewTypeChange('map');
          prevViewType.current = 'map';
        }
      } else if (distance >= 3.5 && prevDistance.current < 3.5) {
        if (prevViewType.current !== 'globe') {
          onViewTypeChange('globe');
          prevViewType.current = 'globe';
        }
      }
      
      prevDistance.current = distance;
    }
  });

  return null;
}

export default function Globe3D({ waterResources, onResourceClick }: Globe3DProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [viewType, setViewType] = useState<ViewType>('globe');
  const [isRotating, setIsRotating] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(5.5);
  const controlsRef = useRef<any>(null);

  const viewModes: Array<{ id: ViewMode; label: string; icon: typeof Globe; color: string }> = [
    { id: 'standard', label: 'Стандарт', icon: Globe, color: 'cyan' },
    { id: 'satellite', label: 'AI Спутник', icon: Satellite, color: 'yellow' },
    { id: 'ecology', label: 'Экология', icon: Activity, color: 'emerald' },
    { id: 'infrastructure', label: 'Инфраструктура', icon: Zap, color: 'blue' },
  ];

  // Reset camera when switching view types
  useEffect(() => {
    if (controlsRef.current && viewType === 'map') {
      // Adjust camera for map view
      controlsRef.current.minDistance = 1;
      controlsRef.current.maxDistance = 4;
    } else if (controlsRef.current && viewType === 'globe') {
      controlsRef.current.minDistance = 3.5;
      controlsRef.current.maxDistance = 8;
    }
  }, [viewType]);

  const toggleViewType = () => {
    setViewType(prev => prev === 'globe' ? 'map' : 'globe');
  };

  return (
    <div className="w-full h-full relative group">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <spotLight 
          position={[-10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          color={viewMode === 'standard' ? '#22d3ee' : viewMode === 'satellite' ? '#fbbf24' : '#10b981'} 
        />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        <AnimatePresence mode="wait">
          {viewType === 'globe' ? (
            <Earth 
              key="earth"
              waterResources={waterResources} 
              onResourceClick={onResourceClick}
              mode={viewMode}
            />
          ) : (
            <MapView
              key="map"
              waterResources={waterResources}
              onResourceClick={onResourceClick}
              mode={viewMode}
            />
          )}
        </AnimatePresence>
        
        <OrbitControls
          ref={controlsRef}
          enablePan={viewType === 'map'}
          enableZoom={true}
          minDistance={viewType === 'map' ? 1 : 3.5}
          maxDistance={viewType === 'map' ? 4 : 8}
          rotateSpeed={0.5}
          autoRotate={isRotating && viewType === 'globe'}
          autoRotateSpeed={0.5}
          onStart={() => setIsRotating(false)}
          onEnd={() => setIsRotating(true)}
        />
        
        <CameraController 
          onZoomChange={setCameraDistance}
          onViewTypeChange={setViewType}
        />
      </Canvas>

      {/* View Type Toggle */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={toggleViewType}
          className="glass px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm uppercase tracking-wider transition-all hover:bg-white/10 active:scale-95"
        >
          {viewType === 'globe' ? (
            <>
              <Map className="w-4 h-4 text-cyan-glow" />
              <span className="text-cyan-glow hidden sm:inline">Map View</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 text-cyan-glow" />
              <span className="text-cyan-glow hidden sm:inline">Globe View</span>
            </>
          )}
        </button>
      </div>

      {/* Controls Overlay - Mobile First */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-20 justify-center md:justify-start">
        {viewModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = viewMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider
                transition-all duration-200 active:scale-95
                ${isActive 
                  ? `bg-${mode.color}-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]` 
                  : 'glass text-slate-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <Icon size={14} /> 
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* GIS Engine Status - Desktop Only */}
      <div className="absolute top-4 right-4 z-20 hidden md:block">
        <div className="glass px-4 py-2 rounded-xl flex flex-col items-end gap-1 border border-cyan-glow/20">
          <div className="flex items-center gap-2">
            <Zap className="text-cyan-glow animate-pulse" size={14} />
            <span className="text-xs font-bold text-cyan-glow uppercase tracking-wider">
              GIS Engine Active
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-semibold">
            DATA SOURCE: FAO / WRI / WORLD BANK
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Zoom: {cameraDistance.toFixed(1)}x
          </div>
        </div>
      </div>

      {/* Resource Count Badge */}
      <div className="absolute top-16 left-4 z-20 hidden sm:block">
        <div className="glass px-3 py-2 rounded-xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Resources
          </div>
          <div className="text-lg font-black text-cyan-glow">
            {waterResources.length}
          </div>
        </div>
      </div>

      {/* Zoom Indicator */}
      {viewType === 'map' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 glass px-4 py-2 rounded-xl"
        >
          <div className="text-xs font-bold text-cyan-glow uppercase tracking-wider text-center">
            Map View Mode - Detailed Analysis
          </div>
        </motion.div>
      )}
    </div>
  );
}
