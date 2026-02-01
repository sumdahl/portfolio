export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    // Note: In production, verify the webhook signature here using `resend-signature` header.
    // if (!verifySignature(req.headers.get('resend-signature'), process.env.RESEND_WEBHOOK_SECRET)) ...

    const { type, data } = await req.json();
    const resendId = data?.email_id;

    if (!resendId) return NextResponse.json({ message: 'No email_id' }, { status: 400 });

    const statusMap: Record<string, string> = {
      'email.delivered': 'delivered',
      'email.bounced': 'bounced',
    };

    const status = statusMap[type];

    if (status) {
      await db.update(messages)
        .set({ deliveryStatus: status })
        .where(eq(messages.resendId, resendId));
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
