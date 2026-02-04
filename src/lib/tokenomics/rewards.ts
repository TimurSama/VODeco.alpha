/**
 * VODeco Rewards Calculation Module
 * 
 * All reward calculations based on tokenomics
 * Total airdrop pool: 5-10% of total supply
 */

import { TOTAL_SUPPLY } from './calculations';

// Airdrop pool allocation (5% of total supply)
export const AIRDROP_POOL_TOTAL = TOTAL_SUPPLY * 0.05; // 50,000,000 VOD

// Pool allocations
export const AIRDROP_POOLS = {
  socialShare: AIRDROP_POOL_TOTAL * 0.4,      // 40% - 20M VOD
  referral: AIRDROP_POOL_TOTAL * 0.4,          // 40% - 20M VOD
  mission: AIRDROP_POOL_TOTAL * 0.15,          // 15% - 7.5M VOD
  newsSubmission: AIRDROP_POOL_TOTAL * 0.05,    // 5% - 2.5M VOD
};

// Social Share Rewards
export interface SocialShareReward {
  base: number;
  engagementBonus: number;
  viralBonus: number;
  total: number;
}

export function calculateSocialShareReward(
  likes: number,
  shares: number,
  isViral: boolean = false
): SocialShareReward {
  const base = 50; // Base reward
  const engagements = likes + shares;
  
  // Engagement bonus: +10 VOD per 100 engagements (max 50)
  const engagementBonus = Math.min(
    Math.floor(engagements / 100) * 10,
    50
  );
  
  // Viral bonus: +100 VOD if 1000+ engagements
  const viralBonus = isViral || engagements >= 1000 ? 100 : 0;
  
  const total = Math.min(base + engagementBonus + viralBonus, 200); // Max 200 VOD per share
  
  return {
    base,
    engagementBonus,
    viralBonus,
    total,
  };
}

// Referral Rewards
export interface ReferralReward {
  referrer: number;
  referred: number;
}

export function calculateReferralReward(
  referrerReferralCount: number
): ReferralReward {
  // Referrer reward based on tier
  let referrerReward = 200; // Default for 51+ referrals
  
  if (referrerReferralCount < 10) {
    referrerReward = 500; // First 10 referrals
  } else if (referrerReferralCount < 50) {
    referrerReward = 300; // 11-50 referrals
  }
  
  // Tier bonus: +100 VOD if referrer has 10+ active referrals
  const tierBonus = referrerReferralCount >= 10 ? 100 : 0;
  
  return {
    referrer: referrerReward + tierBonus,
    referred: 200, // Bonus for referred user (in addition to 1000 welcome bonus)
  };
}

// Mission Rewards
export interface MissionReward {
  base: number;
  qualityBonus: number;
  earlyBonus: number;
  total: number;
}

export function calculateMissionReward(
  missionType: 'vacancy' | 'task' | 'news_submission' | 'partnership',
  complexity: 'low' | 'medium' | 'high' = 'medium',
  isEarly: boolean = false,
  quality: 'low' | 'medium' | 'high' = 'medium'
): MissionReward {
  let base = 0;
  
  // Base rewards by type
  switch (missionType) {
    case 'vacancy':
      base = complexity === 'low' ? 500 : complexity === 'medium' ? 2000 : 5000;
      break;
    case 'task':
      base = complexity === 'low' ? 100 : complexity === 'medium' ? 500 : 2000;
      break;
    case 'news_submission':
      base = 20;
      break;
    case 'partnership':
      base = complexity === 'low' ? 1000 : complexity === 'medium' ? 5000 : 10000;
      break;
  }
  
  // Quality bonus
  const qualityBonus = quality === 'high' ? base * 0.3 : quality === 'medium' ? base * 0.15 : 0;
  
  // Early completion bonus (10% of base)
  const earlyBonus = isEarly ? base * 0.1 : 0;
  
  return {
    base,
    qualityBonus: Math.floor(qualityBonus),
    earlyBonus: Math.floor(earlyBonus),
    total: base + Math.floor(qualityBonus) + Math.floor(earlyBonus),
  };
}

// News Submission Rewards
export interface NewsSubmissionReward {
  base: number;
  qualityBonus: number;
  relevanceBonus: number;
  firstSubmissionBonus: number;
  total: number;
}

export function calculateNewsSubmissionReward(
  isApproved: boolean,
  isPublished: boolean,
  isHighlyRelevant: boolean,
  isFirstSubmission: boolean
): NewsSubmissionReward {
  const base = 20;
  
  // Quality bonus: +30 VOD if approved and published
  const qualityBonus = isApproved && isPublished ? 30 : 0;
  
  // Relevance bonus: +50 VOD if highly relevant to water resources
  const relevanceBonus = isHighlyRelevant ? 50 : 0;
  
  // First submission bonus
  const firstSubmissionBonus = isFirstSubmission ? 10 : 0;
  
  return {
    base,
    qualityBonus,
    relevanceBonus,
    firstSubmissionBonus,
    total: base + qualityBonus + relevanceBonus + firstSubmissionBonus,
  };
}

// User Level & XP Calculation
export const XP_REWARDS = {
  socialShare: 10,
  referral: 50,
  mission: 100,
  newsSubmission: 20,
  staking: 5, // Per 100 VOD staked
  achievement: 200,
};

export const XP_PER_LEVEL = [
  0,      // Level 1 (starting)
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  4000,   // Level 7
  8000,   // Level 8
  16000,  // Level 9
  32000,  // Level 10
];

export function calculateLevel(xp: number): number {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  if (currentLevel >= XP_PER_LEVEL.length) {
    return 0; // Max level
  }
  return XP_PER_LEVEL[currentLevel] - currentXP;
}

// Level benefits (higher staking APY, etc.)
export function getLevelBenefits(level: number): {
  stakingAPYBonus: number; // Percentage bonus
  prioritySupport: boolean;
} {
  return {
    stakingAPYBonus: Math.min(level * 0.5, 5), // Max 5% bonus
    prioritySupport: level >= 5,
  };
}

// Daily limits
export const DAILY_LIMITS = {
  socialShare: 5, // Max 5 shares per platform per day
  newsSubmission: 10, // Max 10 news submissions per day
};

// Check if user can perform action today
export function canPerformAction(
  action: 'social_share' | 'news_submission',
  todayCount: number
): boolean {
  const limit = DAILY_LIMITS[action === 'social_share' ? 'socialShare' : 'newsSubmission'];
  return todayCount < limit;
}
