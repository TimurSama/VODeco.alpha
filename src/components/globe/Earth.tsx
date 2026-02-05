'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Vector3 } from 'three';
import { WaterResource } from '@/lib/api/water-resources';
import * as THREE from 'three';

interface EarthProps {
  waterResources: WaterResource[];
  onResourceClick: (resource: WaterResource) => void;
  mode?: 'standard' | 'satellite' | 'ecology' | 'infrastructure';
  isRotating?: boolean;
}

export default function Earth({ waterResources, onResourceClick, mode = 'standard', isRotating = true }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Загрузка реальных текстур Земли
  const [earthTexture, normalMap, specularMap, nightMap] = useLoader(TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png'
  ]);

  useFrame(() => {
    if (earthRef.current && isRotating) {
      earthRef.current.rotation.y += 0.0005;
    }
  });

  // Конвертация lat/lon в 3D координаты
  const getCoordinates = (lat: number, lon: number, radius: number): Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new Vector3(x, y, z);
  };

  // Определение цвета маркера в зависимости от типа и качества
  const getMarkerColor = (resource: WaterResource): string => {
    if (resource.qualityIndex !== undefined) {
      if (resource.qualityIndex > 70) return '#10b981'; // emerald - хорошее качество
      if (resource.qualityIndex > 40) return '#fbbf24'; // gold - среднее качество
      return '#ef4444'; // red - плохое качество
    }
    
    // Цвет по типу ресурса
    switch (resource.type) {
      case 'river': return '#22d3ee'; // cyan
      case 'lake': return '#3b82f6'; // blue
      case 'sea': return '#0ea5e9'; // sky blue
      case 'ocean': return '#0284c7'; // deep blue
      case 'station': return '#f59e0b'; // amber
      case 'treatment': return '#8b5cf6'; // purple
      case 'organization': return '#ec4899'; // pink
      default: return '#22d3ee';
    }
  };

  // Фильтрация ресурсов по режиму просмотра
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

  return (
    <group>
      {/* Основная сфера Земли */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          normalMap={normalMap}
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.2}
          emissive={mode === 'satellite' ? '#fbbf24' : '#22d3ee'}
          emissiveMap={nightMap}
          emissiveIntensity={mode === 'standard' ? 0.5 : mode === 'satellite' ? 1.5 : 0.3}
          transparent={mode === 'ecology' || mode === 'infrastructure'}
          opacity={mode === 'ecology' || mode === 'infrastructure' ? 0.7 : 1}
        />
      </mesh>

      {/* Атмосфера для режима экологии/инфраструктуры */}
      {(mode === 'ecology' || mode === 'infrastructure') && (
        <mesh scale={[1.01, 1.01, 1.01]}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            wireframe
            color={mode === 'ecology' ? '#10b981' : '#3b82f6'}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Маркеры водных ресурсов */}
      {filteredResources.map((resource) => {
        const position = getCoordinates(resource.latitude, resource.longitude, 2.01);
        const color = getMarkerColor(resource);
        const size = resource.qualityIndex ? 
          (resource.qualityIndex > 70 ? 0.05 : resource.qualityIndex > 40 ? 0.04 : 0.06) : 
          0.04;

        return (
          <group key={resource.id} position={position}>
            {/* Основной маркер */}
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
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            
            {/* Пульсирующее свечение вокруг маркера */}
            <mesh scale={[2, 2, 2]}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={0.2}
              />
            </mesh>
            
            {/* Линия связи с поверхностью (для объектов и субъектов) */}
            {(resource.category === 'object' || resource.category === 'subject') && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array([
                      position.x, position.y, position.z,
                      position.x * 0.95, position.y * 0.95, position.z * 0.95
                    ]), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={color} opacity={0.5} transparent />
              </line>
            )}
          </group>
        );
      })}
    </group>
  );
}
