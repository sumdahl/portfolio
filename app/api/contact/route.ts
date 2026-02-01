export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { Resend } from 'resend';
import disposableDomains from 'disposable-email-domains';
import dns from 'dns';
import { promisify } from 'util';
import { contactSchema } from '@/lib/validations/contact';
import { eq } from 'drizzle-orm';

const resolveMx = promisify(dns.resolveMx);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function validateEmail(email: string): Promise<{ valid: boolean; error?: string }> {
  const domain = email.split('@')[1];
  if (!domain) return { valid: false, error: 'Invalid email address.' };

  if (disposableDomains.includes(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed.' };
  }

  try {
    const addresses = await resolveMx(domain);
    if (!addresses || addresses.length === 0) {
      return { valid: false, error: 'Invalid email domain (no MX records).' };
    }
  } catch (error: any) {
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return { valid: false, error: 'Invalid email domain. Please check your email address.' };
    }
  }

  return { valid: true };
}

async function checkRateLimit(email: string): Promise<boolean> {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const recentMessages = await db.query.messages.findMany({
    where: (messages, { eq, and, gt }) =>
      and(
        eq(messages.email, email),
        gt(messages.createdAt, threeHoursAgo)
      ),
    limit: 1,
  });
  return recentMessages.length === 0;
}

async function sendNotificationEmail(name: string, email: string, message: string): Promise<string | null> {
  if (!resend) return null;

  try {
    const result = await resend.emails.send({
      from: 'Sumiran Dahal <onboarding@resend.dev>',
      to: 'sumirandahal46@gmail.com',
      subject: `📬 New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>📬 New Contact Message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr />
          <p style="white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });
    return result.data?.id || null;
  } catch (error) {
    console.error('Resend exception:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = contactSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input.', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    let { name, email, message } = validation.data;
    email = email.toLowerCase();

    const emailCheck = await validateEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json({ success: false, error: emailCheck.error }, { status: 400 });
    }

    if (!(await checkRateLimit(email))) {
       return NextResponse.json(
        { success: false, error: 'You can send another message after 3 hours.' },
        { status: 429 }
      );
    }

    const [insertedMessage] = await db.insert(messages).values({
      name, email, message, deliveryStatus: 'pending'
    }).returning({ id: messages.id });

    // Background task - do not await
    (async () => {
      try {
        const resendId = await sendNotificationEmail(name, email, message);
        await db.update(messages)
          .set(resendId ? { resendId } : { deliveryStatus: 'failed' })
          .where(eq(messages.id, insertedMessage.id));
      } catch (err) {
         console.error('Background email task error:', err);
      }
    })();

    return NextResponse.json(
      { success: true, message: 'Message received. If the email address is valid, it will be processed accordingly.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
