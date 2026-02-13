'use client';

import { ProjectCard as UnifiedProjectCard } from '@/components/cards';
import type { ProjectCardData } from '@/components/cards';
import { Project } from '@/lib/api/projects';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const projectCardData: ProjectCardData = {
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description || '',
    type: project.type || 'O-VOD',
    location: project.location,
    irr: project.irr ? parseFloat(project.irr) : undefined,
    targetAmount: project.targetAmount,
    currentAmount: project.currentAmount,
    status: (project.status as 'draft' | 'active' | 'completed' | 'archived') || 'active',
    metadata: project.metadata,
    imageUrl: project.imageUrl,
  };

  return <UnifiedProjectCard project={projectCardData} index={index} />;
}
