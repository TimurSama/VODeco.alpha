'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard, ProductCard } from '@/components/cards';
import type { ProjectCardData, ProductCardData } from '@/components/cards';
import InfoPopup from './InfoPopup';
import { fetchProjects, Project } from '@/lib/api/projects';
import { products } from '@/lib/data/products';

interface OverviewScreen6Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function OverviewScreen6({ onNext, onPrev }: OverviewScreen6Props) {
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectCardData | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'projects' | 'products'>('projects');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        const projectCards: ProjectCardData[] = data.map((p: Project) => ({
          id: p.id,
          slug: p.slug || undefined,
          name: p.name,
          description: p.description || '',
          type: p.type || 'O-VOD',
          location: p.location || undefined,
          irr: p.irr ? parseFloat(p.irr) : undefined,
          targetAmount: p.targetAmount || undefined,
          currentAmount: p.currentAmount || undefined,
          status: 'active' as const,
          metadata: p.metadata,
        }));
        setProjects(projectCards);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.type === filter);

  const projectTypes = ['all', 'P-VOD', 'R-VOD', 'O-VOD', 'Mega-Project'];
  const uniqueTypes = Array.from(new Set(projects.map(p => p.type)));

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ocean-deep">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-glow/10 via-transparent to-cyan-glow/10" />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 gradient-text">
            ProjectHUB
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Разрабатываемые проекты и продукты
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('projects')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              viewMode === 'projects'
                ? 'neo-button text-cyan-glow'
                : 'glass text-white/70 hover:bg-white/10'
            }`}
          >
            Проекты
          </button>
          <button
            onClick={() => setViewMode('products')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              viewMode === 'products'
                ? 'neo-button text-cyan-glow'
                : 'glass text-white/70 hover:bg-white/10'
            }`}
          >
            Продукты
          </button>
        </div>

        {/* Filters */}
        {viewMode === 'projects' && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            {projectTypes.filter(type => type === 'all' || uniqueTypes.includes(type)).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === type
                    ? 'neo-button text-cyan-glow'
                    : 'glass text-white/70 hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'Все' : type}
              </button>
            ))}
          </div>
        )}

        {/* Projects/Products Grid */}
        {viewMode === 'projects' ? (
          loading ? (
            <div className="text-center py-20">
              <div className="text-white/60">Загрузка проектов...</div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-white/60">Нет проектов по выбранному фильтру</div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                onClick={() => {
                  // Можно добавить попап для продуктов
                }}
              />
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onPrev}
            className="px-6 py-3 neo-button rounded-xl font-semibold text-white hover:scale-105 transition-all"
          >
            Назад
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 neo-button rounded-xl font-semibold text-white hover:scale-105 transition-all"
          >
            Далее
          </button>
        </div>
      </div>

      {/* Project Details Popup */}
      {selectedProject && (
        <InfoPopup
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.name}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Описание</h4>
              <p className="text-white/80 leading-relaxed">{selectedProject.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {selectedProject.type && (
                <div className="glass-card p-4">
                  <div className="text-sm text-white/60 mb-1">Тип проекта</div>
                  <div className="text-lg font-semibold text-cyan-glow">{selectedProject.type}</div>
                </div>
              )}
              {selectedProject.irr && (
                <div className="glass-card p-4">
                  <div className="text-sm text-white/60 mb-1">IRR</div>
                  <div className="text-lg font-semibold text-emerald-glow">{selectedProject.irr}%</div>
                </div>
              )}
              {selectedProject.targetAmount && (
                <div className="glass-card p-4">
                  <div className="text-sm text-white/60 mb-1">Целевая сумма</div>
                  <div className="text-lg font-semibold text-gold-glow">
                    {parseFloat(selectedProject.targetAmount).toLocaleString()} VOD
                  </div>
                </div>
              )}
              {selectedProject.currentAmount && (
                <div className="glass-card p-4">
                  <div className="text-sm text-white/60 mb-1">Собрано</div>
                  <div className="text-lg font-semibold text-cyan-glow">
                    {parseFloat(selectedProject.currentAmount).toLocaleString()} VOD
                  </div>
                </div>
              )}
            </div>

            {selectedProject.location && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Локация</h4>
                <p className="text-white/80">{selectedProject.location}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button className="flex-1 px-6 py-3 neo-button rounded-xl font-semibold text-white hover:scale-105 transition-all">
                Инвестировать
              </button>
              <button className="flex-1 px-6 py-3 glass rounded-xl font-semibold text-white hover:bg-white/10 transition-all">
                Стейкать
              </button>
            </div>
          </div>
        </InfoPopup>
      )}
    </div>
  );
}
