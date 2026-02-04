'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, MapPin, Calendar, Coins, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  type: string;
  status: string;
  targetAmount?: string;
  currentAmount: string;
  irr?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [stakingAmount, setStakingAmount] = useState('');

  useEffect(() => {
    if (params.slug) {
      loadProject(params.slug as string);
    }
  }, [params.slug]);

  const loadProject = async (slug: string) => {
    try {
      const response = await fetch(`/api/projects/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!stakingAmount || parseFloat(stakingAmount) <= 0) return;
    
    try {
      const response = await fetch('/api/wallet/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project?.id,
          amount: stakingAmount,
        }),
      });

      if (response.ok) {
        alert(t('projects.stakeSuccess'));
        setStakingAmount('');
      }
    } catch (error) {
      console.error('Error staking:', error);
      alert(t('projects.stakeError'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-neon-cyan">{t('common.loading')}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">{t('projects.notFound')}</p>
          <Link href="/projects" className="text-neon-cyan hover:underline">
            {t('projects.backToProjects')}
          </Link>
        </div>
      </div>
    );
  }

  const progress = project.targetAmount
    ? (parseFloat(project.currentAmount) / parseFloat(project.targetAmount)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-bg-primary p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-white/60 hover:text-neon-cyan transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('common.back')}</span>
        </button>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 glass rounded-full text-sm capitalize">
                  {project.type}
                </span>
                {project.irr && (
                  <div className="flex items-center gap-1 text-neon-green">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold text-lg">{project.irr}% APY</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
              {project.location && (
                <div className="flex items-center gap-2 text-white/60 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{project.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {project.targetAmount && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-white/60">{t('projects.funded')}</span>
                <span className="font-bold text-neon-cyan">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 glass rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-green"
                />
              </div>
              <div className="flex justify-between text-sm mt-2 text-white/60">
                <span>{parseFloat(project.currentAmount).toLocaleString()} VOD</span>
                <span>{parseFloat(project.targetAmount).toLocaleString()} VOD</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <p className="text-white/80 leading-relaxed">
              {project.fullDescription || project.description}
            </p>
          </div>
        </motion.div>

        {/* Staking Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h2 className="text-2xl font-bold mb-4">{t('projects.stakeNow')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">{t('projects.stakeAmount')}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={stakingAmount}
                  onChange={(e) => setStakingAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                />
                <span className="px-4 py-3 glass rounded-lg">VOD</span>
              </div>
            </div>
            <button
              onClick={handleStake}
              disabled={!stakingAmount || parseFloat(stakingAmount) <= 0}
              className="w-full px-6 py-4 bg-neon-cyan text-white rounded-lg font-semibold hover:bg-neon-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Coins className="w-5 h-5" />
              <span>{t('projects.stake')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
