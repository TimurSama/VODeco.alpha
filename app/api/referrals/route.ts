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

    // Get reward transactions and sum manually (amount is String in SQLite, cannot use _sum)
    const rewardTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.userId,
        type: 'reward',
        description: { contains: 'Referral' },
      },
      select: {
        amount: true,
      },
    });

    const totalRewards = rewardTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );

    return NextResponse.json({
      code: referral.code,
      link: referral.link,
      status: referral.status,
      totalReferrals,
      totalRewards: totalRewards.toString(),
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
