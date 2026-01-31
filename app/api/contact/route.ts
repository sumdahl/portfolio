import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { Resend } from 'resend';
import disposableDomains from 'disposable-email-domains';
import dns from 'dns';
import { promisify } from 'util';
import { contactSchema } from '@/lib/validations/contact';
// import { desc, eq } from 'drizzle-orm';

const resolveMx = promisify(dns.resolveMx);

// Initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

async function checkMxRecord(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  try {
    const addresses = await resolveMx(domain);
    return addresses && addresses.length > 0;
  } catch (error) {
    console.error(`MX record lookup failed for ${domain}:`, error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = contactSchema.parse(body);

    const domain = email.split('@')[1].toLowerCase();

    // 1. Enhanced Email Validation
    // Check for disposable domain
    // disposable-email-domains exports an array of strings
    if (disposableDomains.includes(domain)) {
       return NextResponse.json(
        { success: false, error: 'Disposable email addresses are not allowed.' },
        { status: 400 }
      );
    }

    // Check MX records to ensure domain can receive email
    const hasMxRecord = await checkMxRecord(email);
    if (!hasMxRecord) {
        return NextResponse.json(
            { success: false, error: 'Invalid email domain. Please check your email address.' },
            { status: 400 }
        );
    }


    // 2. Rate Limiting (Database Level)
    // Check if the email has submitted a message in the last 3 hours
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    
    // Using Drizzle to query for recent messages
    const recentMessages = await db.query.messages.findMany({
        where: (messages, { eq, and, gt }) => and(
            eq(messages.email, email),
            gt(messages.createdAt, threeHoursAgo)
        ),
        limit: 1,
    });

    if (recentMessages.length > 0) {
        return NextResponse.json(
            { success: false, error: 'Rate limit exceeded. Please try again in a few hours.' },
            { status: 429 }
        );
    }

    // 3. Save to Database (Primary Storage)
    await db.insert(messages).values({
      name,
      email,
      message,
    });

    // 4. Send Email Notification (Optional - requires RESEND_API_KEY)
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Sumiran Dahal <onboarding@resend.dev>',
          to: 'sumirandahal46@gmail.com',
          subject: `📬 New Message from ${name} via Your Portfolio`,
          text: `
You have a new message from your portfolio contact form.

Name: ${name}
Email: ${email}

Message:
${message}
          `,
          html: `
<div style="font-family: 'Helvetica', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #fafafa;">
  <h1 style="text-align: center; color: #1a73e8; font-size: 24px;">👋 New Message from Your Portfolio</h1>
  <div style="margin-top: 20px;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8; text-decoration: none;">${email}</a></p>
  </div>
  <div style="margin-top: 20px;">
    <h3 style="margin-bottom: 10px;">Message:</h3>
    <p style="white-space: pre-wrap; background-color: #f0f0f0; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #555;">
    <p>This message was sent via your portfolio website.</p>
    <p>— Sumiran Dahal</p>
  </div>
</div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email via Resend:', emailError);
      }
    } else {
      console.log("RESEND_API_KEY not found. Message saved to DB but email not sent.");
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
       // Should be handled by safeParse now, but keeping just in case
      return NextResponse.json( // id: 6a3bcf8e
        { success: false, message: 'Validation failed', error: 'Please check your input.', details: (error as z.ZodError).flatten() },
        { status: 400 }
      );
    }

    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: 'Internal server error' },
      { status: 500 }
    );
  }
}
