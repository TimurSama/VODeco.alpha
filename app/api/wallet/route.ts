import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;
    const userId = user.userId;

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        stakings: {
          where: { status: 'active' },
          include: {
            project: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Calculate staked amount
    const staked = wallet.stakings.reduce(
      (sum, staking) => sum + parseFloat(staking.amount),
      0
    );

    const balance = parseFloat(wallet.balance);
    const available = balance - staked;

    return NextResponse.json({
      userId,
      balance: balance.toString(),
      staked: staked.toString(),
      available: available.toString(),
      transactions: wallet.transactions,
      stakings: wallet.stakings,
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}
