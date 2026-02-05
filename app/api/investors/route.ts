import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const fund = typeof body?.fund === 'string' ? body.fund.trim() : null;
    const role = typeof body?.role === 'string' ? body.role.trim() : null;
    const website = typeof body?.website === 'string' ? body.website.trim() : null;
    const country = typeof body?.country === 'string' ? body.country.trim() : null;
    const ticketSize = typeof body?.ticketSize === 'string' ? body.ticketSize.trim() : null;
    const stageFocus = typeof body?.stageFocus === 'string' ? body.stageFocus.trim() : null;
    const message = typeof body?.message === 'string' ? body.message.trim() : null;

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const created = await prisma.investorInquiry.create({
      data: {
        name,
        email,
        fund,
        role,
        website,
        country,
        ticketSize,
        stageFocus,
        message,
      },
    });

    return NextResponse.json({ id: created.id });
  } catch (error) {
    console.error('Error creating investor inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
