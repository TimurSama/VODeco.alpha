import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { calculateMissionReward, XP_REWARDS } from '@/lib/tokenomics/rewards';
import { addUserXP } from '@/lib/gamification/levels';
import { grantAchievement } from '@/lib/gamification/achievements';

const REVIEWER_ROLES = ['government', 'institution', 'ngo'];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;
    const reviewer = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true },
    });
    if (!reviewer || !REVIEWER_ROLES.includes(reviewer.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = body?.status === 'approved' ? 'approved' : 'rejected';

    const submission = await prisma.missionSubmission.findUnique({
      where: { id },
      include: { mission: true, user: { include: { wallet: true } } },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.status !== 'pending') {
      return NextResponse.json({ error: 'Submission already reviewed' }, { status: 400 });
    }

    let rewardAmount = 0;
    if (status === 'approved') {
      const meta = submission.mission.metadata ? JSON.parse(submission.mission.metadata) : {};
      const complexity = meta?.complexity || 'medium';
      const quality = meta?.quality || 'medium';
      const reward = calculateMissionReward(submission.mission.type as any, complexity, false, quality);
      rewardAmount = reward.total;
    }

    await prisma.missionSubmission.update({
      where: { id },
      data: {
        status,
        rewardAmount: rewardAmount.toString(),
        reviewedAt: new Date(),
      },
    });

    if (status === 'approved' && submission.user.wallet) {
      const newBalance = parseFloat(submission.user.wallet.balance) + rewardAmount;
      await prisma.wallet.update({
        where: { id: submission.user.wallet.id },
        data: { balance: newBalance.toString() },
      });

      await prisma.transaction.create({
        data: {
          walletId: submission.user.wallet.id,
          userId: submission.user.id,
          type: 'reward',
          amount: rewardAmount.toString(),
          status: 'completed',
          description: `Mission reward: ${submission.mission.title}`,
          metadata: JSON.stringify({ submissionId: submission.id }),
        },
      });

      await addUserXP(submission.user.id, XP_REWARDS.mission);

      const approvedCount = await prisma.missionSubmission.count({
        where: { userId: submission.user.id, status: 'approved' },
      });
      if (approvedCount === 1) {
        await grantAchievement(submission.user.id, 'first_mission');
      }
      if (approvedCount >= 3) {
        await grantAchievement(submission.user.id, 'mission_master');
      }
    }

    return NextResponse.json({ success: true, status, rewardAmount });
  } catch (error) {
    console.error('Error reviewing mission:', error);
    return NextResponse.json({ error: 'Failed to review mission' }, { status: 500 });
  }
}
