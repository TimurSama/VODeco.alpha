'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/context';
import { fetchProjects, Project } from '@/lib/api/projects';
import ProjectCard from '@/components/projects/ProjectCard';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Link from 'next/link';
import { BookOpen, Briefcase } from 'lucide-react';

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-deep flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-card p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">TokenHub</div>
            <div className="text-white font-black text-lg">Проекты связаны с механиками WhitePaper</div>
            <div className="text-slate-400 text-sm">Откройте интерактивный WhitePaper: фазы, экономическая логика, калькуляторы.</div>
          </div>
          <Link href="/whitepaper#economy" className="px-4 py-2 neo-button rounded-xl font-semibold inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            WhitePaper → TokenHub
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 gradient-text">{t('projects.title')}</h1>
          <p className="text-white/60">{t('projects.subtitle')}</p>
        </motion.div>

        {projects.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Нет проектов"
            description="Проекты появятся здесь после их добавления. Следите за обновлениями!"
            action={{
              label: 'Открыть WhitePaper',
              onClick: () => window.location.href = '/whitepaper#economy',
            }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
