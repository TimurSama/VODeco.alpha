'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Heart, Send, EyeOff, Search, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FeedPost = {
  id: string;
  content: string;
  type: string;
  tags?: string | null;
  attachments?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  author?: {
    username?: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  };
  _count?: {
    comments: number;
  };
};

type FeedComment = {
  id: string;
  content: string;
  createdAt: string;
  replies?: FeedComment[];
  author?: {
    username?: string;
    firstName?: string | null;
    lastName?: string | null;
  };
};

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, FeedComment[]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isModerator, setIsModerator] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [selectedType, selectedTag, searchQuery]);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedTag.trim()) params.append('tag', selectedTag.trim());
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load posts');
      setPosts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (!res.ok) return;
      const role = data?.user?.role;
      setIsModerator(['government', 'institution', 'ngo'].includes(role));
    } catch {
      // ignore
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load comments');
      setComments((prev) => ({ ...prev, [postId]: Array.isArray(data) ? data : [] }));
    } catch (e: any) {
      setError(e?.message || 'Failed to load comments');
    }
  };

  const toggleComments = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (!comments[postId]) {
      await loadComments(postId);
    }
  };

  const submitComment = async (postId: string) => {
    const content = (commentDrafts[postId] || '').trim();
    if (!content) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.status === 401) {
        setError('Нужен вход для комментария.');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add comment');
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data],
      }));
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    } catch (e: any) {
      setError(e?.message || 'Failed to add comment');
    }
  };

  const submitReply = async (postId: string, parentId: string) => {
    const content = (replyDrafts[parentId] || '').trim();
    if (!content) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
      });
      if (res.status === 401) {
        setError('Нужен вход для комментария.');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add reply');
      await loadComments(postId);
      setReplyDrafts((prev) => ({ ...prev, [parentId]: '' }));
    } catch (e: any) {
      setError(e?.message || 'Failed to add reply');
    }
  };

  const hidePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/moderation/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'hidden' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to hide post');
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (e: any) {
      setError(e?.message || 'Failed to hide post');
    }
  };

  const hideComment = async (postId: string, commentId: string) => {
    try {
      const res = await fetch(`/api/moderation/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'hidden' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to hide comment');
      await loadComments(postId);
    } catch (e: any) {
      setError(e?.message || 'Failed to hide comment');
    }
  };

  const safeParseArray = (value?: string | null) => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const renderAttachments = (attachments: any[]) => {
    if (!attachments.length) return null;
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

  const availableTags = Array.from(
    new Set(
      posts.flatMap((post) => safeParseArray(post.tags).map((tag: string) => tag.toLowerCase()))
    )
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-white">Социальная лента</h1>
          <p className="text-slate-400">Публикации, обсуждения, исследования.</p>
        </div>

        <div className="glass-card p-4 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по публикациям…"
              className="w-full pl-9 pr-3 py-2 glass rounded-lg text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'post', 'news', 'research', 'achievement', 'project_card'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-cyan-glow text-white'
                    : 'glass text-slate-400 hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'Все' : type}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-500" />
              <input
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                placeholder="Тег"
                className="px-3 py-1.5 glass rounded-lg text-xs text-white placeholder:text-slate-500"
              />
            </div>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs ${
                  selectedTag.toLowerCase() === tag
                    ? 'bg-cyan-glow text-white'
                    : 'glass text-slate-400 hover:bg-white/10'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-rose-300 mb-4">{error}</div>}

        {loading ? (
          <div className="text-slate-400">Загрузка…</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => {
              const author =
                post.author?.firstName || post.author?.lastName
                  ? `${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim()
                  : post.author?.username || 'User';
              const tags = safeParseArray(post.tags);
              const attachments = safeParseArray(post.attachments);
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>{author}</span>
                    <span className="px-2 py-0.5 glass rounded-lg">{post.type}</span>
                  </div>
                  <div className="text-white whitespace-pre-wrap">{post.content}</div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-1 glass rounded text-xs text-cyan-glow">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {renderAttachments(attachments)}
                  <div className="flex items-center gap-4 mt-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> 0
                    </div>
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1 hover:text-cyan-glow transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {post._count?.comments ?? 0}
                    </button>
                    {isModerator && (
                      <button
                        onClick={() => hidePost(post.id)}
                        className="flex items-center gap-1 text-rose-300 hover:text-rose-200"
                      >
                        <EyeOff className="w-4 h-4" />
                        Скрыть
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedPostId === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3"
                      >
                        <div className="space-y-2">
                          {(comments[post.id] || []).map((comment) => {
                            const commentAuthor =
                              comment.author?.firstName || comment.author?.lastName
                                ? `${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`.trim()
                                : comment.author?.username || 'User';
                            return (
                              <div key={comment.id} className="glass p-3 rounded-lg">
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                  <span>{commentAuthor}</span>
                                  {isModerator && (
                                    <button
                                      onClick={() => hideComment(post.id, comment.id)}
                                      className="flex items-center gap-1 text-rose-300 hover:text-rose-200"
                                    >
                                      <EyeOff className="w-3 h-3" />
                                      Скрыть
                                    </button>
                                  )}
                                </div>
                                <div className="text-sm text-white/90">{comment.content}</div>
                                <div className="mt-2 pl-3 border-l border-white/10 space-y-2">
                                  {(comment.replies || []).map((reply) => {
                                    const replyAuthor =
                                      reply.author?.firstName || reply.author?.lastName
                                        ? `${reply.author?.firstName || ''} ${reply.author?.lastName || ''}`.trim()
                                        : reply.author?.username || 'User';
                                    return (
                                      <div key={reply.id} className="glass p-2 rounded-lg">
                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                          <span>{replyAuthor}</span>
                                          {isModerator && (
                                            <button
                                              onClick={() => hideComment(post.id, reply.id)}
                                              className="flex items-center gap-1 text-rose-300 hover:text-rose-200"
                                            >
                                              <EyeOff className="w-3 h-3" />
                                              Скрыть
                                            </button>
                                          )}
                                        </div>
                                        <div className="text-sm text-white/90">{reply.content}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="mt-2 flex gap-2">
                                  <input
                                    value={replyDrafts[comment.id] || ''}
                                    onChange={(e) =>
                                      setReplyDrafts((prev) => ({ ...prev, [comment.id]: e.target.value }))
                                    }
                                    placeholder="Ответ…"
                                    className="flex-1 px-2 py-1 glass rounded-lg text-xs text-white placeholder:text-slate-500"
                                  />
                                  <button
                                    onClick={() => submitReply(post.id, comment.id)}
                                    className="px-2 py-1 bg-cyan-glow text-white rounded-lg text-xs"
                                  >
                                    Ответить
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={commentDrafts[post.id] || ''}
                            onChange={(e) =>
                              setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            placeholder="Комментарий…"
                            className="flex-1 px-3 py-2 glass rounded-lg text-sm text-white placeholder:text-slate-500"
                          />
                          <button
                            onClick={() => submitComment(post.id)}
                            className="px-3 py-2 bg-cyan-glow text-white rounded-lg"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
