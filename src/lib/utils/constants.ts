/**
 * Application constants
 */

export const APP_NAME = 'VODeco';
export const APP_DESCRIPTION = 'Decentralized Water Resource Management Platform';

export const PROJECT_TYPES = {
  blockchain: 'Blockchain',
  iot: 'IoT',
  research: 'Research',
  education: 'Education',
  infrastructure: 'Infrastructure',
} as const;

export const WATER_RESOURCE_TYPES = {
  river: 'River',
  lake: 'Lake',
  sea: 'Sea',
  ocean: 'Ocean',
  glacier: 'Glacier',
  underground: 'Underground Water',
  station: 'Pumping Station',
  treatment: 'Treatment Plant',
  organization: 'Organization',
} as const;

export const WATER_RESOURCE_CATEGORIES = {
  source: 'Water Source',
  object: 'Infrastructure Object',
  subject: 'Organization/Subject',
} as const;

export const TRANSACTION_TYPES = {
  transfer: 'Transfer',
  staking: 'Staking',
  reward: 'Reward',
  purchase: 'Purchase',
} as const;

export const STAKING_STATUS = {
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const;
