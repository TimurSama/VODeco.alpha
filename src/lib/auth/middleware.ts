/**
 * Authentication Middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    // Try to get from cookies as fallback
    const cookieToken = request.cookies.get('auth_token')?.value;
    if (cookieToken) {
      return verifyToken(cookieToken);
    }
    return null;
  }
  
  return verifyToken(token);
}

/**
 * Require authentication middleware
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return { user };
}

/**
 * Optional authentication (doesn't fail if no auth)
 */
export async function optionalAuth(
  request: NextRequest
): Promise<JWTPayload | null> {
  return await getAuthenticatedUser(request);
}
