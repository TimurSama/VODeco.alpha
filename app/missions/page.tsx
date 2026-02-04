'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Briefcase,
  Users,
  Newspaper,
  Handshake,
  Filter,
  Search,
  Award,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'vacancy' | 'partnership' | 'news_submission';
  category: string;
  status: string;
  rewardAmount: string;
  rewardType: string;
  maxParticipants?: number;
  currentParticipants: number;
  deadline?: string;
  createdAt: string;
}

const missionTypes = [
  { id: 'all', label: 'All Missions', icon: Target },
  { id: 'vacancy', label: 'Vacancies', icon: Briefcase },
  { id: 'task', label: 'Tasks', icon: Target },
  { id: 'partnership', label: 'Partnerships', icon: Handshake },
  { id: 'news_submission', label: 'News Submissions', icon: Newspaper },
];

const categories = [
  'development',
  'design',
  'marketing',
  'content',
  'research',
  'partnership',
];

export default function MissionsPage() {
  const { t } = useLanguage();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMissions();
  }, [selectedType, selectedCategory]);

  const loadMissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      params.append('status', 'active');

      const response = await fetch(`/api/missions?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch missions');

      const data = await response.json();
      setMissions(data.missions || []);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch =
      !searchQuery ||
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vacancy':
        return Briefcase;
      case 'task':
        return Target;
      case 'partnership':
        return Handshake;
      case 'news_submission':
        return Newspaper;
      default:
        return Target;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacancy':
        return 'from-blue-500 to-cyan-500';
      case 'task':
        return 'from-purple-500 to-pink-500';
      case 'partnership':
        return 'from-green-500 to-emerald-500';
      case 'news_submission':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-deep flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-deep">
      {/* Header */}
      <div className="sticky top-16 z-30 glass border-b border-white/10 mb-6">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Missions & Opportunities</h1>
              <p className="text-slate-400 text-sm">
                Complete missions, earn rewards, and contribute to VODeco ecosystem
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {missionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    selectedType === type.id
                      ? 'bg-cyan-glow text-white'
                      : 'glass text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="container mx-auto px-4 pb-8">
        {filteredMissions.length === 0 ? (
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-400">No missions found</p>
            <p className="text-slate-500 mt-2">
              Check back later for new opportunities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMissions.map((mission, index) => {
              const TypeIcon = getTypeIcon(mission.type);
              const typeColor = getTypeColor(mission.type);

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="neo-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group"
                  onClick={() => window.location.href = `/missions/${mission.id}`}
                >
                  {/* Header */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColor} flex items-center justify-center mb-4`}>
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-black text-white mb-2 group-hover:text-cyan-glow transition-colors line-clamp-2">
                    {mission.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                    {mission.description}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Reward</span>
                      <span className="font-bold text-cyan-glow">
                        {parseFloat(mission.rewardAmount).toLocaleString()} VOD
                      </span>
                    </div>

                    {mission.maxParticipants && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Participants</span>
                        <span className="text-slate-400">
                          {mission.currentParticipants} / {mission.maxParticipants}
                        </span>
                      </div>
                    )}

                    {mission.deadline && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(mission.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="px-3 py-1 glass rounded-lg text-xs font-semibold text-slate-400">
                      {mission.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-cyan-glow">
                      <span>View Details</span>
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
