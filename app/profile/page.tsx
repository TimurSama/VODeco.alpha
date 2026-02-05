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
    role?: string;
    onboardingCompleted?: boolean;
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
  const [roleDraft, setRoleDraft] = useState('');
  const [roleSaving, setRoleSaving] = useState(false);
  const [roleError, setRoleError] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'post' | 'news' | 'research' | 'achievement' | 'project_card'>('post');
  const [postTags, setPostTags] = useState('');
  const [postAttachments, setPostAttachments] = useState<
    { url: string; type: 'image' | 'video' | 'file' | 'link'; title?: string }[]
  >([]);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'video' | 'file' | 'link'>('link');
  const [attachmentTitle, setAttachmentTitle] = useState('');
  const [postError, setPostError] = useState('');
  const [postSaving, setPostSaving] = useState(false);

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
      setRoleDraft(data?.user?.role || 'activist');
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
  const roles = [
    { id: 'activist', label: 'Активист / ранний пользователь' },
    { id: 'researcher', label: 'Исследователь / учёный' },
    { id: 'engineer', label: 'Инженер / инноватор' },
    { id: 'investor', label: 'Инвестор / фонд' },
    { id: 'company', label: 'Компания / корпорация' },
    { id: 'ngo', label: 'НКО / международная организация' },
    { id: 'government', label: 'Государство / регулятор' },
    { id: 'institution', label: 'Институциональный партнёр' },
  ];

  const saveRole = async () => {
    setRoleSaving(true);
    setRoleError('');
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleDraft, onboardingCompleted: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Failed to update role');
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                role: data?.user?.role || roleDraft,
                onboardingCompleted: data?.user?.onboardingCompleted ?? true,
              },
            }
          : prev
      );
    } catch (error: any) {
      setRoleError(error?.message || 'Failed to update role');
    } finally {
      setRoleSaving(false);
    }
  };

  const submitPost = async () => {
    setPostSaving(true);
    setPostError('');
    try {
      const tags = postTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postContent,
          type: postType,
          tags,
          attachments: postAttachments,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Failed to create post');
      setPostContent('');
      setPostTags('');
      setPostAttachments([]);
      await loadProfile();
    } catch (error: any) {
      setPostError(error?.message || 'Failed to create post');
    } finally {
      setPostSaving(false);
    }
  };

  const addAttachment = () => {
    const url = attachmentUrl.trim();
    if (!url) return;
    setPostAttachments((prev) => [
      ...prev,
      {
        url,
        type: attachmentType,
        title: attachmentTitle.trim() || undefined,
      },
    ]);
    setAttachmentUrl('');
    setAttachmentTitle('');
  };

  const removeAttachment = (index: number) => {
    setPostAttachments((prev) => prev.filter((_, i) => i !== index));
  };

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

              {/* Role Selector */}
              <div className="glass p-4 rounded-xl mt-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Роль</div>
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                  <select
                    value={roleDraft}
                    onChange={(e) => setRoleDraft(e.target.value)}
                    className="px-3 py-2 glass rounded-lg border border-white/10 text-white bg-transparent"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={saveRole}
                    disabled={roleSaving}
                    className="px-4 py-2 bg-cyan-glow text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {roleSaving ? 'Сохранение…' : 'Сохранить роль'}
                  </button>
                  {user.onboardingCompleted ? (
                    <span className="text-xs text-emerald-400">Онбординг завершён</span>
                  ) : (
                    <span className="text-xs text-slate-400">Онбординг не завершён</span>
                  )}
                </div>
                {roleError && <div className="text-xs text-rose-300 mt-2">{roleError}</div>}
              </div>
              
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
              <div className="glass p-4 rounded-xl mb-6">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3">
                  Новая публикация
                </div>
                <div className="grid md:grid-cols-3 gap-3 mb-3">
                  <select
                    value={postType}
                    onChange={(e) =>
                      setPostType(
                        e.target.value as 'post' | 'news' | 'research' | 'achievement' | 'project_card'
                      )
                    }
                    className="px-3 py-2 glass rounded-lg border border-white/10 text-white bg-transparent"
                  >
                    <option value="post">Post</option>
                    <option value="news">News</option>
                    <option value="research">Research</option>
                    <option value="achievement">Achievement</option>
                    <option value="project_card">Project card</option>
                  </select>
                  <input
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    placeholder="Теги через запятую"
                    className="px-3 py-2 glass rounded-lg border border-white/10 text-white placeholder:text-slate-500"
                  />
                  <button
                    onClick={submitPost}
                    disabled={postSaving || !postContent.trim()}
                    className="px-4 py-2 bg-cyan-glow text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {postSaving ? 'Публикация…' : 'Опубликовать'}
                  </button>
                </div>
                <div className="grid md:grid-cols-4 gap-3 mb-3">
                  <select
                    value={attachmentType}
                    onChange={(e) =>
                      setAttachmentType(e.target.value as 'image' | 'video' | 'file' | 'link')
                    }
                    className="px-3 py-2 glass rounded-lg border border-white/10 text-white bg-transparent"
                  >
                    <option value="link">Link</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="file">File</option>
                  </select>
                  <input
                    value={attachmentTitle}
                    onChange={(e) => setAttachmentTitle(e.target.value)}
                    placeholder="Название (необязательно)"
                    className="px-3 py-2 glass rounded-lg border border-white/10 text-white placeholder:text-slate-500"
                  />
                  <input
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="URL вложения"
                    className="md:col-span-2 px-3 py-2 glass rounded-lg border border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={addAttachment}
                    disabled={!attachmentUrl.trim()}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    Добавить вложение
                  </button>
                  {postAttachments.length > 0 && (
                    <span className="text-xs text-slate-400">
                      Вложений: {postAttachments.length}
                    </span>
                  )}
                </div>
                {postAttachments.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {postAttachments.map((attachment, index) => (
                      <div
                        key={`${attachment.url}-${index}`}
                        className="flex items-center justify-between glass rounded-lg px-3 py-2 text-xs text-slate-300"
                      >
                        <span className="truncate">
                          [{attachment.type}] {attachment.title || attachment.url}
                        </span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-rose-300 hover:text-rose-200"
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Напишите публикацию…"
                  className="w-full min-h-[120px] glass rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50"
                />
                {postError && <div className="text-xs text-rose-300 mt-2">{postError}</div>}
              </div>
              <PublicationFeed publications={publications} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
