'use client';

import { useState, useEffect } from 'react';
import Globe3D from '@/components/globe/Globe3D';
import { WaterResource } from '@/lib/api/water-resources';
import InfoPopup from './InfoPopup';
import { ProjectCard } from '@/components/cards';
import type { ProjectCardData } from '@/components/cards';

interface GlobeInteractiveProps {
  waterResources: WaterResource[];
  projects?: ProjectCardData[];
  onRegionClick?: (region: string) => void;
  highlightedRegions?: string[];
}

export default function GlobeInteractive({
  waterResources,
  projects = [],
  onRegionClick,
  highlightedRegions = [],
}: GlobeInteractiveProps) {
  const [selectedResource, setSelectedResource] = useState<WaterResource | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectCardData | null>(null);

  const handleResourceClick = (resource: WaterResource) => {
    setSelectedResource(resource);
  };

  const handleProjectClick = (project: ProjectCardData) => {
    setSelectedProject(project);
  };

  return (
    <>
      <div className="w-full h-full relative">
        <Globe3D
          waterResources={waterResources}
          onResourceClick={handleResourceClick}
        />
      </div>

      {/* Resource Info Popup */}
      {selectedResource && (
        <InfoPopup
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          title={selectedResource.name}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <div className="text-sm text-white/60 mb-1">Тип</div>
              <div className="text-lg font-semibold text-white">{selectedResource.type}</div>
            </div>
            {selectedResource.country && (
              <div>
                <div className="text-sm text-white/60 mb-1">Страна</div>
                <div className="text-lg font-semibold text-white">{selectedResource.country}</div>
              </div>
            )}
            {selectedResource.qualityIndex !== undefined && (
              <div>
                <div className="text-sm text-white/60 mb-1">Индекс качества</div>
                <div className="text-lg font-semibold text-cyan-glow">{selectedResource.qualityIndex}</div>
              </div>
            )}
            {selectedResource.description && (
              <div>
                <div className="text-sm text-white/60 mb-1">Описание</div>
                <div className="text-white/80">{selectedResource.description}</div>
              </div>
            )}
          </div>
        </InfoPopup>
      )}

      {/* Project Info Popup */}
      {selectedProject && (
        <InfoPopup
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.name}
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-white/80">{selectedProject.description}</p>
            {selectedProject.irr && (
              <div className="glass-card p-4">
                <div className="text-sm text-white/60 mb-1">IRR</div>
                <div className="text-2xl font-bold text-emerald-glow">{selectedProject.irr}%</div>
              </div>
            )}
            {selectedProject.targetAmount && (
              <div className="glass-card p-4">
                <div className="text-sm text-white/60 mb-1">Целевая сумма</div>
                <div className="text-2xl font-bold text-gold-glow">
                  {parseFloat(selectedProject.targetAmount).toLocaleString()} VOD
                </div>
              </div>
            )}
          </div>
        </InfoPopup>
      )}
    </>
  );
}
