/**
 * Conversion funnel tracking
 * Tracks user journeys: view → click → submit
 */

import { trackEvent } from '../analytics';

export type FunnelStage = 'view' | 'click' | 'submit' | 'complete';

export interface FunnelEvent {
  funnelName: string;
  stage: FunnelStage;
  userId?: string;
  metadata?: Record<string, any>;
}

// Predefined funnels
export const FUNNELS = {
  PARTNER_APPLICATION: 'partner_application',
  INVESTOR_INQUIRY: 'investor_inquiry',
  TOKEN_PURCHASE: 'token_purchase',
  MISSION_SUBMISSION: 'mission_submission',
  SOCIAL_SHARE: 'social_share',
  REFERRAL: 'referral',
  AIRDROP: 'airdrop',
  STAKING: 'staking',
} as const;

/**
 * Track funnel event
 */
export function trackFunnel(funnelName: string, stage: FunnelStage, metadata?: Record<string, any>) {
  trackEvent('funnel_event', {
    funnel: funnelName,
    stage,
    timestamp: Date.now(),
    ...metadata,
  });
}

/**
 * Track view (page/component viewed)
 */
export function trackFunnelView(funnelName: string, metadata?: Record<string, any>) {
  trackFunnel(funnelName, 'view', metadata);
}

/**
 * Track click (CTA button clicked)
 */
export function trackFunnelClick(funnelName: string, ctaId: string, metadata?: Record<string, any>) {
  trackFunnel(funnelName, 'click', { ctaId, ...metadata });
}

/**
 * Track submit (form submitted)
 */
export function trackFunnelSubmit(funnelName: string, metadata?: Record<string, any>) {
  trackFunnel(funnelName, 'submit', metadata);
}

/**
 * Track complete (funnel completed)
 */
export function trackFunnelComplete(funnelName: string, metadata?: Record<string, any>) {
  trackFunnel(funnelName, 'complete', metadata);
}

/**
 * Calculate conversion rate
 * This would typically be done server-side with analytics data
 */
export function calculateConversionRate(
  views: number,
  completes: number
): number {
  if (views === 0) return 0;
  return (completes / views) * 100;
}
