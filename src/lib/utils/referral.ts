/**
 * Referral System Utilities
 */

import crypto from 'crypto';

/**
 * Generate unique referral code
 */
export function generateReferralCode(username: string, userId: string): string {
  // Create a short hash from username and userId
  const hash = crypto
    .createHash('sha256')
    .update(`${username}-${userId}-${Date.now()}`)
    .digest('hex')
    .substring(0, 8)
    .toUpperCase();
  
  // Combine with username prefix (first 3 chars)
  const prefix = username.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${prefix}${hash}`;
}

/**
 * Generate referral link
 */
export function generateReferralLink(code: string, baseUrl?: string): string {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://vodeco.org';
  return `${url}/ref/${code}`;
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  // Code should be 8-12 characters, alphanumeric
  return /^[A-Z0-9]{8,12}$/.test(code);
}
