'use client';

import { useEffect, useState } from 'react';
import { Share2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

type SocialShare = {
  id: string;
  platform: string;
  postUrl: string;
  rewardStatus: string;
  rewardAmount: string;
  metadata?: { likes?: number; shares?: number } | null;
  createdAt: string;
};

export default function SocialSharePage() {
  const [platform, setPlatform] = useState('twitter');
  const [postUrl, setPostUrl] = useState('');
  const [likes, setLikes] = useState('');
  const [shares, setShares] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState<SocialShare[]>([]);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/social/share');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load history');
      setHistory(data.shares || []);
    } catch (e: any) {
      setError(e?.message || 'Ошибка загрузки');
    }
  };

  useEffect(() => {
    loadHistory();
    trackEvent('social_share_view');
  }, []);

  const submit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          postUrl,
          likes: likes ? parseInt(likes, 10) : 0,
          shares: shares ? parseInt(shares, 10) : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to submit');
      setSuccess('Пост отправлен на проверку.');
      setPostUrl('');
      setLikes('');
      setShares('');
      trackEvent('social_share_submit', { platform });
      await loadHistory();
    } catch (e: any) {
      setError(e?.message || 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ocean-deep">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/20 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-cyan-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Social Share</h1>
              <p className="text-slate-400 text-sm">
                Отправьте пост на проверку и получите награду после модерации.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="glass-card p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="px-3 py-2 glass rounded-lg text-white bg-transparent"
            >
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="telegram">Telegram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="vk">VK</option>
            </select>
            <input
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              placeholder="Likes"
              className="px-3 py-2 glass rounded-lg text-white"
            />
            <input
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="Shares"
              className="px-3 py-2 glass rounded-lg text-white"
            />
          </div>
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="Ссылка на пост"
            className="w-full px-3 py-2 glass rounded-lg text-white mb-3"
          />
          {error && <div className="text-rose-300 text-sm mb-2">{error}</div>}
          {success && <div className="text-emerald-300 text-sm mb-2">{success}</div>}
          <button
            onClick={submit}
            disabled={loading || !postUrl.trim()}
            className="px-4 py-2 bg-cyan-glow text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Отправка…' : 'Отправить'}
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="text-sm text-slate-400 mb-4">История отправок</div>
          <div className="space-y-3">
            {history.map((share) => (
              <div key={share.id} className="glass p-3 rounded-lg text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{share.platform}</span>
                  <span className="text-xs text-slate-400">{share.rewardStatus}</span>
                </div>
                <a
                  href={share.postUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-glow text-xs flex items-center gap-1 mt-1"
                >
                  <ExternalLink className="w-3 h-3" /> {share.postUrl}
                </a>
                {share.metadata && (
                  <div className="text-xs text-slate-400 mt-1">
                    likes: {share.metadata.likes || 0} • shares: {share.metadata.shares || 0}
                  </div>
                )}
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-slate-500 text-sm">Пока нет отправок.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

