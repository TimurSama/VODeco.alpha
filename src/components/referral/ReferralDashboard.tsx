'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, Users, TrendingUp, Award, Check } from 'lucide-react';

interface ReferralData {
  code: string;
  link: string;
  status: string;
  totalReferrals: number;
  totalRewards: string;
  createdAt: string;
}

export default function ReferralDashboard() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const response = await fetch('/api/referrals', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch referrals');
      const data = await response.json();
      setReferralData(data);
    } catch (error) {
      console.error('Error loading referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/2"></div>
          <div className="h-20 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-slate-400">Failed to load referral data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Referral Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-black text-white mb-4">Your Referral Code</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Referral Code</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 glass p-4 rounded-xl font-mono text-xl font-bold text-cyan-glow">
                {referralData.code}
              </div>
              <button
                onClick={() => copyToClipboard(referralData.code)}
                className="px-4 py-4 neo-button rounded-xl active:scale-95 transition-all"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5 text-cyan-glow" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">Referral Link</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 glass p-4 rounded-xl text-sm text-slate-300 break-all">
                {referralData.link}
              </div>
              <button
                onClick={() => copyToClipboard(referralData.link)}
                className="px-4 py-4 neo-button rounded-xl active:scale-95 transition-all"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5 text-cyan-glow" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Join VODeco',
                  text: 'Join me on VODeco - a platform for water resource management',
                  url: referralData.link,
                });
              } else {
                copyToClipboard(referralData.link);
              }
            }}
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-glow to-blue-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
          >
            <Share2 className="w-5 h-5" />
            Share Referral Link
          </button>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 text-center"
        >
          <Users className="w-8 h-8 text-cyan-glow mx-auto mb-2" />
          <div className="text-3xl font-black text-white mb-1">
            {referralData.totalReferrals}
          </div>
          <div className="text-sm text-slate-400">Total Referrals</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center"
        >
          <Award className="w-8 h-8 text-cyan-glow mx-auto mb-2" />
          <div className="text-3xl font-black text-white mb-1">
            {parseFloat(referralData.totalRewards).toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Total Rewards (VOD)</div>
        </motion.div>
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
        <div className="space-y-3 text-sm text-slate-400">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-glow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-cyan-glow font-bold text-xs">1</span>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">Share Your Link</div>
              <div>Share your unique referral link with friends and colleagues</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-glow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-cyan-glow font-bold text-xs">2</span>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">They Join</div>
              <div>When someone signs up using your link, they get a bonus</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-glow/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-cyan-glow font-bold text-xs">3</span>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">You Earn</div>
              <div>You receive VOD tokens as a reward for each successful referral</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
