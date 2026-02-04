import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth, optionalAuth } from '@/lib/auth/middleware';

/**
 * GET /api/missions/[id]
 * Get mission details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      );
    }

    const user = await optionalAuth(request);
    let userSubmission = null;

    if (user) {
      userSubmission = await prisma.missionSubmission.findUnique({
        where: {
          missionId_userId: {
            missionId: id,
            userId: user.userId,
          },
        },
      });
    }

    return NextResponse.json({
      mission: {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        type: mission.type,
        category: mission.category,
        status: mission.status,
        rewardAmount: mission.rewardAmount,
        rewardType: mission.rewardType,
        requirements: mission.requirements ? JSON.parse(mission.requirements) : null,
        maxParticipants: mission.maxParticipants,
        currentParticipants: mission.currentParticipants,
        deadline: mission.deadline,
        metadata: mission.metadata ? JSON.parse(mission.metadata) : null,
        createdAt: mission.createdAt,
        updatedAt: mission.updatedAt,
      },
      submissions: mission.submissions.map((sub) => ({
        id: sub.id,
        status: sub.status,
        submittedAt: sub.submittedAt,
        user: sub.user,
        // Don't show content/attachments to other users
      })),
      userSubmission: userSubmission
        ? {
            id: userSubmission.id,
            status: userSubmission.status,
            content: userSubmission.content,
            attachments: userSubmission.attachments
              ? JSON.parse(userSubmission.attachments)
              : null,
            rewardAmount: userSubmission.rewardAmount,
            feedback: userSubmission.feedback,
            submittedAt: userSubmission.submittedAt,
            reviewedAt: userSubmission.reviewedAt,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching mission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mission' },
      { status: 500 }
    );
  }
}
