export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { Resend } from 'resend';
import disposableDomains from 'disposable-email-domains';
import dns from 'dns';
import { promisify } from 'util';
import { contactSchema } from '@/lib/validations/contact';

const resolveMx = promisify(dns.resolveMx);

// Initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

async function checkMxRecord(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  if (!domain) return false;

  try {
    const addresses = await resolveMx(domain);
    return addresses.length > 0;
  } catch (error) {
    console.error(`MX lookup failed for ${domain}:`, error);
    // fail open to avoid random DNS/serverless issues
    return true;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = contactSchema.parse(body);

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    /* -------------------- 1. Email Validation -------------------- */

    // Disposable email check
    if (disposableDomains.includes(domain)) {
      return NextResponse.json(
        { success: false, error: 'Disposable email addresses are not allowed.' },
        { status: 400 }
      );
    }

    // MX record check (best-effort)
    const hasMxRecord = await checkMxRecord(email);
    if (!hasMxRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email domain. Please check your email address.',
        },
        { status: 400 }
      );
    }

    /* -------------------- 2. Rate Limiting (DB) -------------------- */

    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const recentMessages = await db.query.messages.findMany({
      where: (messages, { eq, and, gt }) =>
        and(
          eq(messages.email, email),
          gt(messages.createdAt, threeHoursAgo)
        ),
      limit: 1,
    });

    if (recentMessages.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'You can send another message after 3 hours.',
        },
        { status: 429 }
      );
    }

    /* -------------------- 3. Save to Database -------------------- */

    await db.insert(messages).values({
      name,
      email,
      message,
    });

    /* -------------------- 4. Send Email (Optional) -------------------- */

    if (resend) {
      try {
        await resend.emails.send({
          from: 'Sumiran Dahal <onboarding@resend.dev>',
          to: 'sumirandahal46@gmail.com',
          subject: `📬 New Message from ${name}`,
          text: `
Name: ${name}
Email: ${email}

Message:
${message}
          `,
          html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
  <h2>📬 New Contact Message</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
  <hr />
  <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
  <hr />
  <p style="font-size: 12px; color: #666;">
    Sent from your portfolio contact form.
  </p>
</div>
          `,
        });
      } catch (emailError) {
        console.error('Resend email failed:', emailError);
        // Do NOT fail the request if email sending fails
      }
    }

    /* -------------------- Success -------------------- */

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input.',
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
