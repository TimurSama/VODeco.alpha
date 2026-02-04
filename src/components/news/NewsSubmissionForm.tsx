'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Upload, X, Check } from 'lucide-react';

export default function NewsSubmissionForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sourceUrl: '',
    category: 'water',
    imageUrl: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/news/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit news');
      }

      setSuccess(true);
      setFormData({
        title: '',
        content: '',
        sourceUrl: '',
        category: 'water',
        imageUrl: '',
        tags: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit news');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Submission Successful!</h3>
        <p className="text-slate-400">
          Your news article has been submitted and is pending review.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-glow to-blue-500 flex items-center justify-center">
          <Newspaper className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Submit News Article</h2>
          <p className="text-slate-400 text-sm">Share relevant water and environmental news</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 glass border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500"
            placeholder="Enter news article title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Source URL *
          </label>
          <input
            type="url"
            required
            value={formData.sourceUrl}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500"
            placeholder="https://example.com/news-article"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Content/Description *
          </label>
          <textarea
            required
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500 resize-none"
            placeholder="Enter article content or description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white"
            >
              <option value="water">Water Resources</option>
              <option value="ecology">Ecology</option>
              <option value="research">Research</option>
              <option value="technology">Technology</option>
              <option value="policy">Policy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 glass rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-glow/50 text-white placeholder:text-slate-500"
            placeholder="water, ecology, climate"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-4 bg-gradient-to-r from-cyan-glow to-blue-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Newspaper className="w-5 h-5" />
              <span>Submit News Article</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
