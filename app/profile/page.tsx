'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Users,
  Award,
  FileText,
  TrendingUp,
  Wallet,
  Target,
  Share2,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import AchievementFeed from '@/components/profile/AchievementFeed';
import LevelProgress from '@/components/profile/LevelProgress';
import PublicationFeed from '@/components/profile/PublicationFeed';

interface ProfileData {
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    verified: boolean;
  };
  level: {
    level: number;
    experience: number;
    totalRewards: string;
    achievements: number;
  };
  achievements: any[];
  publications: any[];
  stats: {
    friends: number;
    posts: number;
    achievements: number;
    stakings: number;
    referrals: number;
    totalRewards: string;
  };
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'publications'>('overview');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-deep flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-ocean-deep flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Failed to load profile</p>
        </div>
      </div>
    );
  }

  const { user, level, achievements, publications, stats } = profileData;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'publications', label: 'Publications', icon: FileText },
  ];

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-6 p-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center text-4xl font-bold text-white">
                  {getInitials()}
                </div>
              )}
              {user.verified && (
                <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-1.5">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-white mb-2">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.username}
              </h1>
              <p className="text-cyan-glow mb-2">@{user.username}</p>
              {user.bio && <p className="text-sm text-slate-400 mb-4">{user.bio}</p>}
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="glass p-3 rounded-xl text-center">
                  <Users className="w-5 h-5 text-cyan-glow mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{stats.friends}</div>
                  <div className="text-xs text-slate-400">Friends</div>
                </div>
                <div className="glass p-3 rounded-xl text-center">
                  <FileText className="w-5 h-5 text-cyan-glow mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{stats.posts}</div>
                  <div className="text-xs text-slate-400">Posts</div>
                </div>
                <div className="glass p-3 rounded-xl text-center">
                  <Award className="w-5 h-5 text-cyan-glow mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{stats.achievements}</div>
                  <div className="text-xs text-slate-400">Achievements</div>
                </div>
                <div className="glass p-3 rounded-xl text-center">
                  <Target className="w-5 h-5 text-cyan-glow mx-auto mb-1" />
                  <div className="text-xl font-bold text-white">{stats.referrals}</div>
                  <div className="text-xs text-slate-400">Referrals</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <LevelProgress level={level.level} experience={level.experience} />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-glow text-white'
                    : 'glass text-slate-400 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white mb-4">Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-5 h-5 text-cyan-glow" />
                    <span className="text-slate-400 text-sm">Total Rewards</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {parseFloat(stats.totalRewards).toLocaleString()} VOD
                  </div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-cyan-glow" />
                    <span className="text-slate-400 text-sm">Active Stakings</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.stakings}</div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Share2 className="w-5 h-5 text-cyan-glow" />
                    <span className="text-slate-400 text-sm">Referrals</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.referrals}</div>
                </div>

                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-cyan-glow" />
                    <span className="text-slate-400 text-sm">Achievements</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.achievements}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-2xl font-black text-white mb-4">Achievements</h2>
              <AchievementFeed achievements={achievements} />
            </div>
          )}

          {activeTab === 'publications' && (
            <div>
              <h2 className="text-2xl font-black text-white mb-4">Publications</h2>
              <PublicationFeed publications={publications} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
