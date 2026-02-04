import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { calculateSocialShareReward, canPerformAction } from '@/lib/tokenomics/rewards';
import { XP_REWARDS } from '@/lib/tokenomics/rewards';

/**
 * POST /api/social/share
 * Submit social media share for verification
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const body = await request.json();
    const { platform, postUrl, newsPostId, likes, shares } = body;

    // Validate input
    if (!platform || !postUrl) {
      return NextResponse.json(
        { error: 'Platform and postUrl are required' },
        { status: 400 }
      );
    }

    const validPlatforms = ['twitter', 'facebook', 'telegram', 'linkedin', 'instagram', 'vk'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayShares = await prisma.socialShare.count({
      where: {
        userId: user.userId,
        platform,
        createdAt: { gte: today },
      },
    });

    if (!canPerformAction('social_share', todayShares)) {
      return NextResponse.json(
        { error: 'Daily limit reached for this platform' },
        { status: 400 }
      );
    }

    // Check if URL already submitted
    const existingShare = await prisma.socialShare.findFirst({
      where: {
        userId: user.userId,
        postUrl,
      },
    });

    if (existingShare) {
      return NextResponse.json(
        { error: 'This post has already been submitted' },
        { status: 400 }
      );
    }

    // Calculate reward (will be updated after verification)
    const reward = calculateSocialShareReward(
      likes || 0,
      shares || 0,
      (likes || 0) + (shares || 0) >= 1000
    );

    // Create social share record
    const socialShare = await prisma.socialShare.create({
      data: {
        userId: user.userId,
        platform,
        postUrl,
        newsPostId: newsPostId || null,
        rewardAmount: '0', // Will be updated after verification
        rewardStatus: 'pending',
        metadata: JSON.stringify({
          likes: likes || 0,
          shares: shares || 0,
          calculatedReward: reward,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      share: {
        id: socialShare.id,
        platform: socialShare.platform,
        postUrl: socialShare.postUrl,
        status: socialShare.rewardStatus,
        potentialReward: reward.total,
      },
      message: 'Share submitted for verification. Reward will be distributed after approval.',
    });
  } catch (error) {
    console.error('Error submitting social share:', error);
    return NextResponse.json(
      { error: 'Failed to submit social share' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/social/share
 * Get user's social shares
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    const shares = await prisma.socialShare.findMany({
      where: {
        userId: user.userId,
        ...(platform && { platform }),
        ...(status && { rewardStatus: status }),
      },
      include: {
        newsPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      shares: shares.map((share) => ({
        id: share.id,
        platform: share.platform,
        postUrl: share.postUrl,
        verified: share.verified,
        rewardAmount: share.rewardAmount,
        rewardStatus: share.rewardStatus,
        newsPost: share.newsPost,
        metadata: share.metadata ? JSON.parse(share.metadata) : null,
        createdAt: share.createdAt,
        verifiedAt: share.verifiedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching social shares:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social shares' },
      { status: 500 }
    );
  }
}
