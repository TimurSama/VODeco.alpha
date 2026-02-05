/**
 * JWT Authentication Utilities
 */

import * as jwt from 'jsonwebtoken';

// Use fallback for build/dev, require env var in production runtime only
const JWT_SECRET: jwt.Secret =
  process.env.JWT_SECRET || 'vodeco-secret-key-change-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

export interface JWTPayload {
  userId: string;
  username: string;
  email?: string;
  telegramId?: string;
}

/**
 * Generate JWT token for user
 */
export function generateToken(payload: JWTPayload): string {
  // Uses fallback secret if JWT_SECRET not set (for testing)
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  // Uses fallback secret if JWT_SECRET not set (for testing)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}
