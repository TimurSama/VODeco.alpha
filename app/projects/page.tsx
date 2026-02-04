'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/context';
import { fetchProjects, Project } from '@/lib/api/projects';
import ProjectCard from '@/components/projects/ProjectCard';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-neon-cyan">{t('common.loading')}</div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
