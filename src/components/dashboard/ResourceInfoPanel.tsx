'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X, MapPin, Droplets, Activity, TrendingUp, Globe, Gauge, EyeOff } from 'lucide-react';
import { WaterResource } from '@/lib/api/water-resources';
import { useLanguage } from '@/lib/i18n/context';
import { trackEvent } from '@/lib/analytics';

interface ResourceInfoPanelProps {
  resource: WaterResource | null;
  onClose: () => void;
}

export default function ResourceInfoPanel({ resource, onClose }: ResourceInfoPanelProps) {
  const { t } = useLanguage();
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [isModerator, setIsModerator] = useState(false);
  const resourceId = resource?.id ?? '';
  
  if (!resource) return null;

  useEffect(() => {
    if (!resourceId) return;
    let cancelled = false;
    async function loadComments() {
      setLoadingComments(true);
      setCommentError('');
      try {
        const res = await fetch(`/api/water-resources/${resourceId}/comments`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load comments');
        if (!cancelled) setComments(Array.isArray(data) ? data : []);
      } catch (error: any) {
        if (!cancelled) setCommentError(error?.message || 'Failed to load comments');
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    }
    loadComments();
    return () => {
      cancelled = true;
    };
  }, [resourceId]);

  useEffect(() => {
    let cancelled = false;
    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (!res.ok) return;
        const role = data?.user?.role;
        if (!cancelled) {
          setIsModerator(['government', 'institution', 'ngo'].includes(role));
        }
      } catch {
        // ignore
      }
    }
    loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const submitComment = async () => {
    if (!resourceId) return;
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`/api/water-resources/${resourceId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.status === 401) {
        setCommentError('Нужен вход в аккаунт для комментария.');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to submit comment');
      setComments((prev) => [data, ...prev]);
      setCommentText('');
      trackEvent('resource_comment_submit', { resourceId });
    } catch (error: any) {
      setCommentError(error?.message || 'Failed to submit comment');
    }
  };

  const submitReply = async (parentId: string) => {
    if (!resourceId) return;
    const content = (replyDrafts[parentId] || '').trim();
    if (!content) return;
    try {
      const res = await fetch(`/api/water-resources/${resourceId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
      });
      if (res.status === 401) {
        setCommentError('Нужен вход в аккаунт для комментария.');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to submit comment');
      const refreshed = await fetch(`/api/water-resources/${resourceId}/comments`);
      const refreshedData = await refreshed.json();
      if (refreshed.ok && Array.isArray(refreshedData)) {
        setComments(refreshedData);
      }
      setReplyDrafts((prev) => ({ ...prev, [parentId]: '' }));
      trackEvent('resource_comment_reply', { resourceId });
    } catch (error: any) {
      setCommentError(error?.message || 'Failed to submit comment');
    }
  };

  const hideComment = async (commentId: string) => {
    if (!resourceId) return;
    try {
      const res = await fetch(`/api/moderation/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'hidden' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to hide comment');
      const refreshed = await fetch(`/api/water-resources/${resourceId}/comments`);
      const refreshedData = await refreshed.json();
      if (refreshed.ok && Array.isArray(refreshedData)) {
        setComments(refreshedData);
      }
    } catch (error: any) {
      setCommentError(error?.message || 'Failed to hide comment');
    }
  };

  const getQualityColor = (quality?: number) => {
    if (!quality) return 'text-slate-400';
    if (quality > 70) return 'text-emerald-glow';
    if (quality > 40) return 'text-gold-glow';
    return 'text-rose-glow';
  };

  const getQualityLabel = (quality?: number) => {
    if (!quality) return 'N/A';
    if (quality > 70) return 'Excellent';
    if (quality > 40) return 'Good';
    return 'Poor';
  };

  const getMetadata = () => {
    if (!resource.metadata) return null;
    if (typeof resource.metadata === 'string') {
      try {
        return JSON.parse(resource.metadata);
      } catch {
        return { raw: resource.metadata };
      }
    }
    return resource.metadata;
  };

  const metadata = getMetadata();
  const dataSource =
    typeof metadata?.source === 'string'
      ? metadata.source
      : metadata?.external
        ? 'External source'
        : 'Internal database';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="neo-card p-6 mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">{resource.name}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider">
              <span className="px-2 py-1 glass rounded-lg">{resource.type}</span>
              <span className="px-2 py-1 glass rounded-lg">{resource.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 neo-button rounded-xl hover:bg-white/5 transition-colors active:scale-95"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {resource.country && (
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <div className="p-2 bg-cyan-glow/20 rounded-lg">
                <MapPin className="w-5 h-5 text-cyan-glow" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  {t('common.location')}
                </p>
                <p className="font-bold text-white">{resource.country}</p>
                {resource.region && (
                  <p className="text-sm text-slate-400">{resource.region}</p>
                )}
              </div>
            </div>
          )}

          {resource.qualityIndex !== undefined && (
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <div className="p-2 bg-emerald-glow/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-glow" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  {t('dashboard.qualityIndex')}
                </p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-black ${getQualityColor(resource.qualityIndex)}`}>
                    {resource.qualityIndex}%
                  </p>
                  <span className={`text-xs font-bold ${getQualityColor(resource.qualityIndex)}`}>
                    {getQualityLabel(resource.qualityIndex)}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${resource.qualityIndex}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${
                      resource.qualityIndex > 70 ? 'bg-emerald-glow' :
                      resource.qualityIndex > 40 ? 'bg-gold-glow' : 'bg-rose-glow'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {resource.flowRate !== undefined && (
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Gauge className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Flow Rate
                </p>
                <p className="font-bold text-white">{resource.flowRate} m³/s</p>
              </div>
            </div>
          )}

          {resource.capacity !== undefined && (
            <div className="flex items-center gap-3 p-3 glass rounded-xl">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Droplets className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Capacity
                </p>
                <p className="font-bold text-white">{resource.capacity} m³</p>
              </div>
            </div>
          )}
        </div>

        {resource.description && (
          <div className="mb-6 p-4 glass rounded-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
              {t('common.description')}
            </p>
            <p className="text-white/90 leading-relaxed">{resource.description}</p>
          </div>
        )}

        {(metadata || dataSource) && (
          <div className="mb-6 p-4 glass rounded-xl">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
              Доп. данные
            </p>
            {dataSource && (
              <div className="text-xs text-slate-400 mb-2">
                Источник: <span className="text-white/80">{dataSource}</span>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-300">
              {metadata &&
                Object.entries(metadata).slice(0, 8).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">{key}</span>
                  <span className="text-white/80 truncate">{String(value)}</span>
                </div>
                ))}
            </div>
          </div>
        )}

        {/* Discussions */}
        <div className="mb-6 p-4 glass rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Обсуждения</div>
          </div>
          {commentError && <div className="text-xs text-rose-300 mb-2">{commentError}</div>}
          {loadingComments ? (
            <div className="text-sm text-slate-400">Загрузка обсуждений…</div>
          ) : (
            <div className="space-y-2">
              {comments.length === 0 && <div className="text-sm text-slate-400">Пока нет комментариев.</div>}
              {comments.map((comment) => {
                const author =
                  comment.author?.firstName || comment.author?.lastName
                    ? `${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`.trim()
                    : comment.author?.username || 'User';
                return (
                  <div key={comment.id} className="glass p-3 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{author}</span>
                      {isModerator && (
                        <button
                          onClick={() => hideComment(comment.id)}
                          className="flex items-center gap-1 text-rose-300 hover:text-rose-200"
                        >
                          <EyeOff className="w-3 h-3" />
                          Скрыть
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-white/90">{comment.content}</div>
                    <div className="mt-2 pl-3 border-l border-white/10 space-y-2">
                      {(comment.replies || []).map((reply: any) => {
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
                                  onClick={() => hideComment(reply.id)}
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
                        onClick={() => submitReply(comment.id)}
                        className="px-2 py-1 bg-cyan-glow text-white rounded-lg text-xs"
                      >
                        Ответить
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Добавить комментарий…"
              className="w-full min-h-[80px] glass rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50"
            />
            <button
              onClick={submitComment}
              disabled={!commentText.trim()}
              className="mt-2 px-4 py-2 bg-cyan-glow text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-3 neo-button rounded-xl font-bold text-white hover:bg-white/5 transition-all active:scale-95">
            View on Map
          </button>
          <button className="flex-1 px-4 py-3 bg-cyan-glow text-white rounded-xl font-bold hover:bg-cyan-glow/80 transition-all active:scale-95 shadow-lg shadow-cyan-glow/20">
            View Details
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
