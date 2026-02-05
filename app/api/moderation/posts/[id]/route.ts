import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

const MODERATOR_ROLES = ['government', 'institution', 'ngo'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true },
    });
    if (!dbUser || !MODERATOR_ROLES.includes(dbUser.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    const body = await request.json();
    const status = body?.status === 'hidden' ? 'hidden' : 'active';

    const post = await prisma.post.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error moderating post:', error);
    return NextResponse.json({ error: 'Failed to moderate post' }, { status: 500 });
  }
}
