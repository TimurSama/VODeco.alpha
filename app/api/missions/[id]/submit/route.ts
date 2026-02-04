import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { calculateMissionReward } from '@/lib/tokenomics/rewards';
import { XP_REWARDS } from '@/lib/tokenomics/rewards';

/**
 * POST /api/missions/[id]/submit
 * Submit mission application
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const mission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      );
    }

    if (mission.status !== 'active') {
      return NextResponse.json(
        { error: 'Mission is not active' },
        { status: 400 }
      );
    }

    // Check if user already submitted
    const existingSubmission = await prisma.missionSubmission.findUnique({
      where: {
        missionId_userId: {
          missionId: id,
          userId: user.userId,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted this mission' },
        { status: 400 }
      );
    }

    // Check max participants
    if (mission.maxParticipants && mission.currentParticipants >= mission.maxParticipants) {
      return NextResponse.json(
        { error: 'Mission has reached maximum participants' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, attachments } = body;

    // Create submission
    const submission = await prisma.missionSubmission.create({
      data: {
        missionId: id,
        userId: user.userId,
        content: content || null,
        attachments: attachments ? JSON.stringify(attachments) : null,
        status: 'pending',
        rewardAmount: '0', // Will be updated after review
      },
    });

    // Update mission participants count
    await prisma.mission.update({
      where: { id },
      data: {
        currentParticipants: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
      message: 'Mission submission created. It will be reviewed by administrators.',
    });
  } catch (error) {
    console.error('Error submitting mission:', error);
    return NextResponse.json(
      { error: 'Failed to submit mission' },
      { status: 500 }
    );
  }
}
