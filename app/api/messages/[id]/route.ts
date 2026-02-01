import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // In a real app, you might want to check for admin role specifically
    // if (user.user_metadata?.role !== 'admin') { ... }

    const { id } = await params;

    await db.delete(messages).where(eq(messages.id, id));

    return NextResponse.json({ message: "Message deleted" });
  } catch (error) {
    console.error('[MESSAGE_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
