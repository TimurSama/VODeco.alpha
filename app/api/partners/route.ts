import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const organization = typeof body?.organization === 'string' ? body.organization.trim() : '';
    const role = typeof body?.role === 'string' ? body.role.trim() : null;
    const website = typeof body?.website === 'string' ? body.website.trim() : null;
    const country = typeof body?.country === 'string' ? body.country.trim() : null;
    const partnershipType =
      typeof body?.partnershipType === 'string' ? body.partnershipType.trim() : '';
    const projectFocus = typeof body?.projectFocus === 'string' ? body.projectFocus.trim() : null;
    const budgetRange = typeof body?.budgetRange === 'string' ? body.budgetRange.trim() : null;
    const message = typeof body?.message === 'string' ? body.message.trim() : null;

    if (!name || !email || !organization || !partnershipType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const created = await prisma.partnerApplication.create({
      data: {
        name,
        email,
        organization,
        role,
        website,
        country,
        partnershipType,
        projectFocus,
        budgetRange,
        message,
      },
    });

    return NextResponse.json({ id: created.id });
  } catch (error) {
    console.error('Error creating partner application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
