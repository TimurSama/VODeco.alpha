import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;
    const userId = user.userId;

    const body = await request.json();
    const { projectId, amount } = body;

    // Validate input
    if (!projectId || !amount || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Get user wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    const stakeAmount = parseFloat(amount);
    const currentBalance = parseFloat(wallet.balance);

    if (currentBalance < stakeAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create staking
    const staking = await prisma.staking.create({
      data: {
        userId,
        walletId: wallet.id,
        projectId,
        amount: stakeAmount.toString(),
        apy: project.irr,
        status: 'active',
      },
    });

    // Update wallet balance
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: (currentBalance - stakeAmount).toString(),
      },
    });

    // Update project current amount
    const currentProjectAmount = parseFloat(project.currentAmount);
    await prisma.project.update({
      where: { id: projectId },
      data: {
        currentAmount: (currentProjectAmount + stakeAmount).toString(),
      },
    });

    // Create transaction
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        userId,
        type: 'staking',
        amount: stakeAmount.toString(),
        status: 'completed',
        description: `Staked in ${project.name}`,
      },
    });

    return NextResponse.json({ success: true, staking });
  } catch (error) {
    console.error('Error staking:', error);
    return NextResponse.json(
      { error: 'Failed to stake' },
      { status: 500 }
    );
  }
}
