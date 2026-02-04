import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

/**
 * GET /api/referrals
 * Get user's referral code and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    // Get user's referral code
    const referral = await prisma.referral.findFirst({
      where: { referrerId: user.userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!referral) {
      return NextResponse.json(
        { error: 'Referral code not found' },
        { status: 404 }
      );
    }

    // Get statistics
    const totalReferrals = await prisma.referral.count({
      where: {
        referrerId: user.userId,
        status: 'used',
      },
    });

    const totalRewards = await prisma.transaction.aggregate({
      where: {
        userId: user.userId,
        type: 'reward',
        description: { contains: 'Referral' },
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      code: referral.code,
      link: referral.link,
      status: referral.status,
      totalReferrals,
      totalRewards: totalRewards._sum.amount || '0',
      createdAt: referral.createdAt,
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}
