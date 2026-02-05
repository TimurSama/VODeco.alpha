import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: { waterResourceId: id, status: 'active' },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    const byParent = new Map<string, any[]>();
    const roots: any[] = [];
    comments.forEach((comment) => {
      const key = comment.parentId || 'root';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push({ ...comment, replies: [] });
    });
    const attach = (node: any) => {
      const children = byParent.get(node.id) || [];
      node.replies = children;
      children.forEach(attach);
    };
    (byParent.get('root') || []).forEach((root) => {
      attach(root);
      roots.push(root);
    });

    return NextResponse.json(roots);
  } catch (error) {
    console.error('Error fetching water resource comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

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
    const { id } = await params;
    const body = await request.json();
    const content = typeof body?.content === 'string' ? body.content.trim() : '';
    const parentId = typeof body?.parentId === 'string' ? body.parentId : null;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: user.userId,
        waterResourceId: id,
        parentId,
      },
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating water resource comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
