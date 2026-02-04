import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { calculateNewsSubmissionReward, canPerformAction } from '@/lib/tokenomics/rewards';
import { XP_REWARDS } from '@/lib/tokenomics/rewards';

/**
 * POST /api/news/submit
 * Submit news article for review
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const body = await request.json();
    const { title, content, sourceUrl, category, imageUrl, tags } = body;

    if (!title || !content || !sourceUrl) {
      return NextResponse.json(
        { error: 'Title, content, and source URL are required' },
        { status: 400 }
      );
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySubmissions = await prisma.newsPost.count({
      where: {
        authorId: user.userId,
        createdAt: { gte: today },
      },
    });

    if (!canPerformAction('news_submission', todaySubmissions)) {
      return NextResponse.json(
        { error: 'Daily limit reached for news submissions' },
        { status: 400 }
      );
    }

    // Check if URL already submitted
    const existingNews = await prisma.newsPost.findFirst({
      where: {
        sourceUrl,
      },
    });

    if (existingNews) {
      return NextResponse.json(
        { error: 'This news article has already been submitted' },
        { status: 400 }
      );
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create news post (unpublished, pending review)
    const newsPost = await prisma.newsPost.create({
      data: {
        title,
        slug: `${slug}-${Date.now()}`,
        content,
        excerpt: content.substring(0, 200),
        sourceUrl,
        source: 'user_submission',
        authorId: user.userId,
        imageUrl: imageUrl || null,
        published: false, // Requires admin approval
        publishedAt: null,
      },
    });

    // Create mission submission if there's a corresponding mission
    const newsSubmissionMission = await prisma.mission.findFirst({
      where: {
        type: 'news_submission',
        status: 'active',
      },
    });

    if (newsSubmissionMission) {
      // Check if user already submitted for this mission
      const existingSubmission = await prisma.missionSubmission.findUnique({
        where: {
          missionId_userId: {
            missionId: newsSubmissionMission.id,
            userId: user.userId,
          },
        },
      });

      if (!existingSubmission) {
        await prisma.missionSubmission.create({
          data: {
            missionId: newsSubmissionMission.id,
            userId: user.userId,
            content: `News submission: ${title}`,
            attachments: JSON.stringify({
              newsPostId: newsPost.id,
              sourceUrl,
            }),
            status: 'pending',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      newsPost: {
        id: newsPost.id,
        title: newsPost.title,
        slug: newsPost.slug,
        status: 'pending',
      },
      message: 'News article submitted successfully. It will be reviewed by administrators.',
    });
  } catch (error) {
    console.error('Error submitting news:', error);
    return NextResponse.json(
      { error: 'Failed to submit news article' },
      { status: 500 }
    );
  }
}
