'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  User,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  author?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  fileUrl?: string;
  imageUrl?: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  publishedAt?: string;
  createdAt: string;
}

const types = [
  { id: 'all', label: 'All Types' },
  { id: 'research', label: 'Research' },
  { id: 'article', label: 'Articles' },
  { id: 'study', label: 'Studies' },
  { id: 'publication', label: 'Publications' },
  { id: 'project_card', label: 'Project Cards' },
];

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'water_resources', label: 'Water Resources' },
  { id: 'ecology', label: 'Ecology' },
  { id: 'technology', label: 'Technology' },
  { id: 'policy', label: 'Policy' },
  { id: 'science', label: 'Science' },
];

export default function LibraryPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadItems();
  }, [selectedType, selectedCategory]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/library?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch library items');

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error loading library items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'research':
      case 'article':
      case 'study':
      case 'publication':
        return FileText;
      case 'project_card':
        return BookOpen;
      default:
        return FileText;
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
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Library</h1>
              <p className="text-slate-400 text-sm">
                Research, articles, studies, and publications
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    loadItems();
                  }
                }}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedType === type.id
                      ? 'bg-cyan-glow text-white'
                      : 'glass text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
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

      {/* Library Grid */}
      <div className="container mx-auto px-4 pb-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-400">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="neo-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group"
                  onClick={() => window.location.href = `/library/${item.id}`}
                >
                  {/* Image */}
                  {item.imageUrl && (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-cyan-glow/20 to-blue-500/20">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Type Icon */}
                  {!item.imageUrl && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center mb-4">
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-black text-white mb-2 group-hover:text-cyan-glow transition-colors line-clamp-2">
                    {item.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Author */}
                  {item.author && (
                    <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                      <User className="w-3 h-3" />
                      <span>@{item.author.username}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 glass rounded text-xs text-cyan-glow"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                    {item.fileUrl && (
                      <Download className="w-4 h-4 text-cyan-glow" />
                    )}
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
