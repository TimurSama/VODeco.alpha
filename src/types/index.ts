/**
 * Global TypeScript types
 */

export type Language = 'en' | 'ru';

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  telegramId?: string;
  telegramUsername?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: string;
  staked: string;
  available: string;
}

export interface Transaction {
  id: string;
  type: 'transfer' | 'staking' | 'reward' | 'purchase';
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: string;
}

export interface Staking {
  id: string;
  projectId: string;
  projectName: string;
  amount: string;
  apy?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  rewards: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  type: 'blockchain' | 'iot' | 'research' | 'education' | 'infrastructure';
  status: 'active' | 'completed' | 'paused';
  targetAmount?: string;
  currentAmount: string;
  irr?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface WaterResource {
  id: string;
  name: string;
  type: 'river' | 'lake' | 'sea' | 'ocean' | 'glacier' | 'underground' | 'station' | 'treatment' | 'organization';
  category: 'source' | 'object' | 'subject';
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  description?: string;
  qualityIndex?: number;
  flowRate?: number;
  capacity?: number;
  status: string;
}
