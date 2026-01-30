import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // In a real app, you might want to check for admin role specifically
    // if (session.user.role !== 'admin') { ... }

    const { id } = await params;

    await db.delete(messages).where(eq(messages.id, id));

    return NextResponse.json({ message: "Message deleted" });
  } catch (error) {
    console.error('[MESSAGE_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
