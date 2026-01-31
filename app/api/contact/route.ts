import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { Resend } from 'resend';

// Initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

import { contactSchema } from '@/lib/validations/contact';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = contactSchema.parse(body);

    // 1. Save to Database (Primary Storage)
    await db.insert(messages).values({
      name,
      email,
      message,
    });

    // 2. Send Email Notification (Optional - requires RESEND_API_KEY)
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
      { success: true, message: 'Message received and saved.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: (error as any).errors },
        { status: 400 }
      );
    }

    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
