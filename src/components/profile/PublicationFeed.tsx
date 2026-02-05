'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Video, Music, Award, Briefcase, Calendar, Heart, MessageCircle } from 'lucide-react';

interface Publication {
  id: string;
  type: 'post' | 'news' | 'research' | 'achievement' | 'project_card';
  content: string;
  imageUrl?: string;
  attachments?: any[];
  tags?: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

interface PublicationFeedProps {
  publications: Publication[];
}

export default function PublicationFeed({ publications }: PublicationFeedProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredPublications = publications.filter(
    (pub) => selectedType === 'all' || pub.type === selectedType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news':
        return FileText;
      case 'research':
        return FileText;
      case 'achievement':
        return Award;
      case 'project_card':
        return Briefcase;
      default:
        return FileText;
    }
  };

  const renderAttachments = (attachments?: any[]) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="mt-3 space-y-2">
        {attachments.map((attachment, index) => {
          const url = attachment?.url as string;
          const type = attachment?.type as string;
          const title = attachment?.title as string;
          if (!url) return null;
          if (type === 'image') {
            return (
              <div key={`${url}-${index}`} className="rounded-xl overflow-hidden">
                <img src={url} alt={title || 'Attachment'} className="w-full h-auto" />
              </div>
            );
          }
          if (type === 'video') {
            return (
              <div key={`${url}-${index}`} className="rounded-xl overflow-hidden">
                <video src={url} controls className="w-full h-auto" />
              </div>
            );
          }
          return (
            <a
              key={`${url}-${index}`}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-cyan-glow hover:underline break-all"
            >
              {title || url}
            </a>
          );
        })}
      </div>
    );
  };

  if (publications.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg font-semibold">No publications yet</p>
        <p className="text-slate-500 text-sm mt-2">
          Start sharing your thoughts, achievements, and research
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Type Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'post', 'news', 'research', 'achievement', 'project_card'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedType === type
                ? 'bg-cyan-glow text-white'
                : 'glass text-slate-400 hover:bg-white/5'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Publications */}
      <div className="space-y-4">
        {filteredPublications.map((publication, index) => {
          const TypeIcon = getTypeIcon(publication.type);

          return (
            <motion.article
              key={publication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center">
                  <TypeIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white capitalize">{publication.type}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(publication.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              {publication.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img
                    src={publication.imageUrl}
                    alt="Publication"
                    className="w-full h-auto"
                  />
                </div>
              )}

              <p className="text-white mb-4 whitespace-pre-wrap">{publication.content}</p>

              {/* Tags */}
              {publication.tags && publication.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {publication.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 glass rounded text-xs text-cyan-glow"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {renderAttachments(publication.attachments)}

              {/* Footer */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>{publication.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span>{publication.comments}</span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
