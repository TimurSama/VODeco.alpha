import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const walletAddress =
      typeof body?.walletAddress === 'string' ? body.walletAddress.trim() : null;
    const preferredNetwork =
      typeof body?.preferredNetwork === 'string' ? body.preferredNetwork.trim() : null;
    const amount = typeof body?.amount === 'string' ? body.amount.trim() : '';
    const currency = typeof body?.currency === 'string' ? body.currency.trim() : 'VOD';
    const message = typeof body?.message === 'string' ? body.message.trim() : null;

    if (!name || !email || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const created = await prisma.tokenPurchaseRequest.create({
      data: {
        name,
        email,
        walletAddress,
        preferredNetwork,
        amount,
        currency,
        message,
      },
    });

    return NextResponse.json({ id: created.id });
  } catch (error) {
    console.error('Error creating token purchase request:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
