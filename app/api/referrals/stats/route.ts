import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

/**
 * GET /api/referrals/stats
 * Get detailed referral statistics
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    // Get all referrals
    const referrals = await prisma.referral.findMany({
      where: { referrerId: user.userId },
      include: {
        referred: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const activeReferrals = referrals.filter((r) => r.status === 'active').length;
    const usedReferrals = referrals.filter((r) => r.status === 'used').length;

    // Calculate total rewards
    const rewardTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.userId,
        type: 'reward',
        description: { contains: 'Referral' },
      },
    });

    const totalRewards = rewardTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );

    return NextResponse.json({
      total: referrals.length,
      active: activeReferrals,
      used: usedReferrals,
      totalRewards: totalRewards.toString(),
      referrals: referrals.map((r) => ({
        id: r.id,
        code: r.code,
        status: r.status,
        rewardAmount: r.rewardAmount,
        createdAt: r.createdAt,
        usedAt: r.usedAt,
        referred: r.referred
          ? {
              id: r.referred.id,
              username: r.referred.username,
              firstName: r.referred.firstName,
              lastName: r.referred.lastName,
              avatar: r.referred.avatar,
              joinedAt: r.referred.createdAt,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}
