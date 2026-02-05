import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

/**
 * GET /api/user/profile
 * Get user profile with achievements, level, and publications
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        wallet: true,
        level: true,
        achievements: {
          include: {
            achievement: true,
          },
          orderBy: { earnedAt: 'desc' },
        },
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        newsPosts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            friends: true,
            posts: true,
            achievements: true,
            stakings: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get referral stats
    const referralStats = await prisma.referral.aggregate({
      where: { referrerId: user.userId },
      _count: { id: true },
    });

    const usedReferrals = await prisma.referral.count({
      where: {
        referrerId: user.userId,
        status: 'used',
      },
    });

    // Get total rewards (sum manually since amount is String in SQLite)
    const rewardTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.userId,
        type: 'reward',
      },
      select: {
        amount: true,
      },
    });

    const totalRewards = rewardTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );

    // Format publications (combine posts and news)
    const publications = [
      ...userData.posts.map((post) => ({
        id: post.id,
        type: post.type || 'post',
        content: post.content,
        imageUrl: post.imageUrl,
        attachments: post.attachments ? JSON.parse(post.attachments) : null,
        tags: post.tags ? JSON.parse(post.tags) : null,
        likes: post.likes,
        comments: 0, // Will be calculated
        createdAt: post.createdAt.toISOString(),
      })),
      ...userData.newsPosts.map((news) => ({
        id: news.id,
        type: 'news' as const,
        content: news.content,
        imageUrl: news.imageUrl,
        attachments: null,
        tags: null,
        likes: news.likes,
        comments: 0, // Will be calculated
        createdAt: news.createdAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        bio: userData.bio,
        role: userData.role,
        onboardingCompleted: userData.onboardingCompleted,
        verified: userData.verified,
        createdAt: userData.createdAt,
      },
      wallet: {
        balance: userData.wallet?.balance || '0',
      },
      level: {
        level: userData.level?.level || 1,
        experience: userData.level?.experience || 0,
        totalRewards: userData.level?.totalRewards || '0',
        achievements: userData.level?.achievements || 0,
      },
      achievements: userData.achievements.map((ua) => ({
        id: ua.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        category: ua.achievement.category,
        points: ua.achievement.points,
        earnedAt: ua.earnedAt.toISOString(),
      })),
      publications,
      stats: {
        friends: userData._count.friends,
        posts: userData._count.posts,
        achievements: userData._count.achievements,
        stakings: userData._count.stakings,
        referrals: usedReferrals,
        totalRewards: totalRewards.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/profile
 * Update role/onboarding fields
 */
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;
    const body = await request.json();
    const role = typeof body?.role === 'string' ? body.role : null;
    const onboardingCompleted =
      typeof body?.onboardingCompleted === 'boolean' ? body.onboardingCompleted : null;

    const allowedRoles = [
      'activist',
      'researcher',
      'engineer',
      'investor',
      'company',
      'ngo',
      'government',
      'institution',
    ];

    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: {
        ...(role ? { role } : {}),
        ...(onboardingCompleted !== null ? { onboardingCompleted } : {}),
      },
      select: {
        id: true,
        role: true,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
