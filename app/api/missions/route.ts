import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { optionalAuth } from '@/lib/auth/middleware';

/**
 * GET /api/missions
 * Get list of missions with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const missions = await prisma.mission.findMany({
      where: {
        ...(type && { type }),
        ...(category && { category }),
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await prisma.mission.count({
      where: {
        ...(type && { type }),
        ...(category && { category }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      missions: missions.map((mission) => ({
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
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/missions
 * Create new mission (admin only - to be implemented)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin check
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
      rewardAmount,
      rewardType,
      requirements,
      maxParticipants,
      deadline,
      metadata,
    } = body;

    if (!title || !description || !type || !category || !rewardAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        type,
        category,
        rewardAmount,
        rewardType: rewardType || 'fixed',
        requirements: requirements ? JSON.stringify(requirements) : null,
        maxParticipants,
        deadline: deadline ? new Date(deadline) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      mission: {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        type: mission.type,
        category: mission.category,
        rewardAmount: mission.rewardAmount,
        createdAt: mission.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating mission:', error);
    return NextResponse.json(
      { error: 'Failed to create mission' },
      { status: 500 }
    );
  }
}
