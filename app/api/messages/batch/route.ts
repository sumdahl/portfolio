import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    await db.delete(messages).where(inArray(messages.id, ids));

    return NextResponse.json({ message: "Messages deleted" });
  } catch (error) {
    console.error('[MESSAGES_BATCH_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
