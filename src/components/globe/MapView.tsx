'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { WaterResource } from '@/lib/api/water-resources';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface MapViewProps {
  waterResources: WaterResource[];
  onResourceClick: (resource: WaterResource) => void;
  mode?: 'standard' | 'satellite' | 'ecology' | 'infrastructure';
}

export default function MapView({ waterResources, onResourceClick, mode = 'standard' }: MapViewProps) {
  const mapRef = useRef<THREE.Mesh>(null);
  
  // Load map texture (flat projection)
  // Load map texture (flat projection)
  const mapTexture = useLoader(
    TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
  ) as THREE.Texture;

  // Filter resources based on mode
  const filteredResources = useMemo(() => {
    if (mode === 'ecology') {
      return waterResources.filter(r => 
        r.category === 'source' || r.type === 'river' || r.type === 'lake'
      );
    }
    if (mode === 'infrastructure') {
      return waterResources.filter(r => 
        r.category === 'object' || r.type === 'station' || r.type === 'treatment'
      );
    }
    if (mode === 'satellite') {
      return waterResources.filter(r => r.category === 'subject' || r.type === 'organization');
    }
    return waterResources;
  }, [waterResources, mode]);

  // Convert lat/lon to flat map coordinates (Mercator projection)
  const latLonToMapCoords = (lat: number, lon: number, radius: number = 2) => {
    // Mercator projection
    const x = (lon / 180) * radius;
    const y = (Math.log(Math.tan((90 + lat) * Math.PI / 360)) / Math.PI) * radius;
    return new THREE.Vector3(x, -y, 0.01);
  };

  const getMarkerColor = (resource: WaterResource): string => {
    if (resource.qualityIndex !== undefined) {
      if (resource.qualityIndex > 70) return '#10b981';
      if (resource.qualityIndex > 40) return '#fbbf24';
      return '#ef4444';
    }
    
    switch (resource.type) {
      case 'river': return '#22d3ee';
      case 'lake': return '#3b82f6';
      case 'sea': return '#0ea5e9';
      case 'ocean': return '#0284c7';
      case 'station': return '#f59e0b';
      case 'treatment': return '#8b5cf6';
      case 'organization': return '#ec4899';
      default: return '#22d3ee';
    }
  };

  return (
    <group>
      {/* Flat Map Plane */}
      <mesh ref={mapRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[4, 2, 64, 32]} />
        <meshStandardMaterial
          map={mapTexture}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Grid Overlay for Map View */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
        <planeGeometry args={[4, 2, 20, 10]} />
        <meshBasicMaterial
          wireframe
          color="#22d3ee"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Water Resource Markers */}
      {filteredResources.map((resource) => {
        const position = latLonToMapCoords(resource.latitude, resource.longitude);
        const color = getMarkerColor(resource);
        const size = resource.qualityIndex ? 
          (resource.qualityIndex > 70 ? 0.08 : resource.qualityIndex > 40 ? 0.06 : 0.1) : 
          0.06;

        return (
          <group key={resource.id} position={position}>
            {/* Marker */}
            <mesh
              onClick={() => onResourceClick(resource)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <cylinderGeometry args={[size, size, 0.1, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            
            {/* Pulse Effect */}
            <mesh scale={[1.5, 1.5, 1]}>
              <cylinderGeometry args={[size, size, 0.05, 16]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={0.3}
              />
            </mesh>

            {/* Label (only on hover/click) */}
            <Html
              position={[0, 0, 0.2]}
              distanceFactor={10}
              style={{ pointerEvents: 'none' }}
            >
              <div className="glass px-2 py-1 rounded-lg text-xs font-bold text-white whitespace-nowrap">
                {resource.name}
              </div>
            </Html>

            {/* Connection Lines for Objects/Subjects */}
            {(resource.category === 'object' || resource.category === 'subject') && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array([
                      position.x, position.y, position.z,
                      position.x, position.y, 0
                    ]), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={color} opacity={0.5} transparent />
              </line>
            )}
          </group>
        );
      })}

      {/* Legend/Info Overlay */}
      <Html position={[-1.8, -0.9, 0.1]}>
        <div className="glass p-3 rounded-lg text-xs max-w-[200px]">
          <div className="font-bold text-cyan-glow mb-2 uppercase tracking-wider">
            Map Legend
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>Good Quality (&gt;70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium Quality (40-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Poor Quality (&lt;40%)</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
