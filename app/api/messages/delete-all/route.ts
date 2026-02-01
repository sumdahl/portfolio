import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Optional: Check if user is admin
    // if (user.user_metadata?.role !== 'admin') { ... }

    await db.delete(messages);

    return NextResponse.json({ message: "All messages deleted" });
  } catch (error) {
    console.error('[MESSAGES_DELETE_ALL]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
