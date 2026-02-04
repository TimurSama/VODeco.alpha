import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { optionalAuth } from '@/lib/auth/middleware';

/**
 * GET /api/library
 * Get library items with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const published = searchParams.get('published') !== 'false';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search');

    const where: any = {
      ...(published && { published: true }),
      ...(type && { type }),
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const items = await prisma.libraryItem.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await prisma.libraryItem.count({ where });

    return NextResponse.json({
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        category: item.category,
        author: item.author,
        content: item.content,
        fileUrl: item.fileUrl,
        imageUrl: item.imageUrl,
        tags: item.tags ? JSON.parse(item.tags) : [],
        published: item.published,
        publishedAt: item.publishedAt,
        views: item.views,
        likes: item.likes,
        comments: item._count.comments,
        metadata: item.metadata ? JSON.parse(item.metadata) : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching library items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch library items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/library
 * Submit new library item
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await optionalAuth(request);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      category,
      content,
      fileUrl,
      imageUrl,
      tags,
      metadata,
    } = body;

    if (!title || !description || !type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const item = await prisma.libraryItem.create({
      data: {
        title,
        description,
        type,
        category,
        authorId: authResult.userId,
        content: content || null,
        fileUrl: fileUrl || null,
        imageUrl: imageUrl || null,
        tags: tags ? JSON.stringify(tags) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        published: false, // Requires admin approval
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        category: item.category,
        author: item.author,
        createdAt: item.createdAt,
      },
      message: 'Library item submitted. It will be reviewed by administrators.',
    });
  } catch (error) {
    console.error('Error creating library item:', error);
    return NextResponse.json(
      { error: 'Failed to create library item' },
      { status: 500 }
    );
  }
}
