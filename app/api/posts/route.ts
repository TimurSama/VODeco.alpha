import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { addUserXP } from '@/lib/gamification/levels';
import { grantAchievement } from '@/lib/gamification/achievements';
import { XP_REWARDS } from '@/lib/tokenomics/rewards';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const allowedTypes = ['post', 'news', 'research', 'achievement', 'project_card'];

    const where: any = { status: 'active' };
    if (type && allowedTypes.includes(type)) {
      where.type = type;
    }
    if (search) {
      where.content = {
        contains: search,
        mode: 'insensitive',
      };
    }
    if (tag) {
      const cleaned = tag.replace('#', '').trim();
      if (cleaned) {
        where.tags = {
          contains: `"${cleaned}"`,
          mode: 'insensitive',
        };
      }
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true, avatar: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;
    const body = await request.json();
    const content = typeof body?.content === 'string' ? body.content.trim() : '';
    const type = typeof body?.type === 'string' ? body.type : 'post';
    const tags = Array.isArray(body?.tags)
      ? body.tags.filter((t: unknown) => typeof t === 'string')
      : [];
    type AttachmentInput = { url: string; type: string; title: string };
    const attachments: AttachmentInput[] = Array.isArray(body?.attachments)
      ? body.attachments
          .map((attachment: Record<string, unknown>) => ({
            url: typeof attachment?.url === 'string' ? attachment.url.trim() : '',
            type: typeof attachment?.type === 'string' ? attachment.type : 'link',
            title: typeof attachment?.title === 'string' ? attachment.title.trim() : '',
          }))
          .filter((attachment: AttachmentInput) => attachment.url)
      : [];

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const allowedTypes = ['post', 'news', 'research', 'achievement', 'project_card'];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid post type' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        content,
        type,
        tags: tags.length ? JSON.stringify(tags) : null,
        attachments: attachments.length ? JSON.stringify(attachments) : null,
        authorId: user.userId,
      },
    });

    await addUserXP(user.userId, XP_REWARDS.newsSubmission);

    const userPostCount = await prisma.post.count({
      where: { authorId: user.userId },
    });
    if (userPostCount === 1) {
      await grantAchievement(user.userId, 'first_post');
    }
    if (userPostCount >= 10) {
      await grantAchievement(user.userId, 'active_contributor');
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
