'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Calendar, ExternalLink, RefreshCw, Filter, Search, TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatRelativeTime } from '@/lib/utils/format';

interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  source?: string;
  sourceUrl?: string;
  imageUrl?: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: any[];
}

export default function NewsPage() {
  const { t } = useLanguage();
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {} as Record<string, number>,
    recentCount: 0,
  });

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'water', label: 'Water Resources' },
    { id: 'ecology', label: 'Ecology' },
    { id: 'research', label: 'Research' },
    { id: 'technology', label: 'Technology' },
    { id: 'policy', label: 'Policy' },
  ];

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async (useAPI = false) => {
    if (useAPI) setRefreshing(true);
    else setLoading(true);
    
    try {
      const url = `/api/news${useAPI ? '?api=true' : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      setNewsPosts(data);
      
      // Calculate stats
      const categoryCounts: Record<string, number> = {};
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      let recentCount = 0;
      
      data.forEach((post: NewsPost) => {
        const publishedDate = new Date(post.publishedAt);
        if (publishedDate > oneWeekAgo) {
          recentCount++;
        }
        // Try to infer category from title/content
        const text = `${post.title} ${post.excerpt || ''}`.toLowerCase();
        let category = 'other';
        if (text.includes('water') || text.includes('aqua')) category = 'water';
        else if (text.includes('ecology') || text.includes('ecosystem')) category = 'ecology';
        else if (text.includes('research') || text.includes('study')) category = 'research';
        else if (text.includes('technology') || text.includes('innovation')) category = 'technology';
        else if (text.includes('policy') || text.includes('government')) category = 'policy';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      setStats({
        total: data.length,
        byCategory: categoryCounts,
        recentCount,
      });
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredNews = newsPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filtering would need to be added to the data model
    return matchesSearch;
  });

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
    <div className="min-h-screen bg-ocean-deep">
      {/* Header */}
      <div className="sticky top-16 z-30 glass border-b border-white/10 mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-cyan-glow" />
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white">{t('news.title')}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{filteredNews.length} articles</span>
                  {stats.recentCount > 0 && (
                    <span className="flex items-center gap-1 text-emerald-glow">
                      <TrendingUp className="w-3 h-3" />
                      {stats.recentCount} this week
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = '/news/submit'}
                className="px-4 py-2 bg-gradient-to-r from-cyan-glow to-blue-500 rounded-xl font-semibold text-sm flex items-center gap-2 active:scale-95 transition-all text-white"
              >
                <span>Submit News</span>
              </button>
              <button
                onClick={() => loadNews(true)}
                disabled={refreshing}
                className="px-4 py-2 neo-button rounded-xl font-semibold text-sm flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-glow text-white'
                      : 'glass text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats.total > 0 && (
        <div className="container mx-auto px-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neo-card p-4 text-center"
            >
              <Newspaper className="w-6 h-6 text-cyan-glow mx-auto mb-2" />
              <div className="text-2xl font-black text-cyan-glow mb-1">{stats.total}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Total Articles</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="neo-card p-4 text-center"
            >
              <TrendingUp className="w-6 h-6 text-emerald-glow mx-auto mb-2" />
              <div className="text-2xl font-black text-emerald-glow mb-1">{stats.recentCount}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">This Week</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="neo-card p-4 text-center"
            >
              <BarChart3 className="w-6 h-6 text-gold-glow mx-auto mb-2" />
              <div className="text-2xl font-black text-gold-glow mb-1">
                {Object.keys(stats.byCategory).length}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Categories</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="neo-card p-4 text-center"
            >
              <Calendar className="w-6 h-6 text-purple-glow mx-auto mb-2" />
              <div className="text-2xl font-black text-purple-glow mb-1">
                {Math.round(stats.total / 7)}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Avg/Day</div>
            </motion.div>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="container mx-auto px-4 pb-8">
        {filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-400">No news found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="neo-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group"
                onClick={() => window.open(post.sourceUrl || '#', '_blank')}
              >
                {/* Image */}
                {post.imageUrl && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-cyan-glow/20 to-blue-500/20">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatRelativeTime(post.publishedAt)}</span>
                    </div>
                    {post.source && (
                      <span className="px-2 py-1 glass rounded-lg text-[10px] font-semibold">
                        {post.source}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-black text-white group-hover:text-cyan-glow transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-sm text-slate-400 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{post.views} views</span>
                      <span>{post.likes} likes</span>
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-cyan-glow group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
