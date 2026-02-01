'use server';

import { db } from '@/lib/db';
import { blogAnalytics, comments, postLikes, users } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { eq, and, sql, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function syncUser(supabaseUser: any) {
    if (!supabaseUser) return null;

    const existingUser = await db.query.users.findFirst({
        where: eq(users.id, supabaseUser.id)
    });

    if (!existingUser) {
        // Check for email collision
        const emailCollision = await db.query.users.findFirst({
            where: eq(users.email, supabaseUser.email || '')
        });

        if (emailCollision) {
            // Delete the conflicting user (cascading to their likes/comments if any)
            // This ensures we can insert the new user with the correct Supabase ID
            await db.delete(users).where(eq(users.id, emailCollision.id));
        }

        // Create new user record
        await db.insert(users).values({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            passwordHash: 'supabase-auth-managed', // Placeholder for non-password auth
            role: 'user', // Default role
        });
    }
    return supabaseUser.id;
}

export async function toggleLike(postId: string, sessionId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userId: string | null = null;

  if (user) {
    userId = await syncUser(user);
  }

  // If no user and no sessionId, we can't track it properly, but for anonymous we expect sessionId
  if (!userId && !sessionId) {
      // Fallback: Just increment? Or error? Client should generate sessionId.
      // Let's assume client sends sessionId for anon.
      return { error: "Session ID required for anonymous likes" };
  }

  // Check if already liked
  const whereClause = userId 
    ? and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))
    : and(eq(postLikes.postId, postId), eq(postLikes.sessionId, sessionId!));

  const existingLike = await db.query.postLikes.findFirst({
    where: whereClause
  });

  if (existingLike) {
    // Unlike
    await db.delete(postLikes).where(whereClause);
    
    // Decrement analytics
    await db.update(blogAnalytics)
        .set({ likes: sql`${blogAnalytics.likes} - 1` })
        .where(eq(blogAnalytics.postId, postId));
        
    revalidatePath(`/blog`);
    return { liked: false };
  } else {
    // Like
    await db.insert(postLikes).values({
        postId,
        userId: userId || null,
        sessionId: userId ? null : sessionId // Store sessionId only if anon
    });

    // Increment analytics
    await db.insert(blogAnalytics)
        .values({ postId, likes: 1 })
        .onConflictDoUpdate({
            target: blogAnalytics.postId,
            set: { likes: sql`${blogAnalytics.likes} + 1` }
        });

    revalidatePath(`/blog`);
    return { liked: true };
  }
}

export async function getLikeStatus(postId: string, sessionId: string) {
    const existingLike = await db.query.postLikes.findFirst({
        where: and(
            eq(postLikes.postId, postId),
            eq(postLikes.sessionId, sessionId)
        )
    });
    return !!existingLike;
}

export async function addComment(postId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userId: string | null = null;
    if (user) {
        userId = await syncUser(user);
    }

    const [comment] = await db.insert(comments).values({
        content,
        postId,
        userId: userId || null, // Nullable for anon
        authorName: user?.user_metadata?.name || 'Anonymous',
    }).returning();

    // Get user details for immediate UI update (if needed)
    // For anon, we just use the returned comment's authorName
    
    revalidatePath(`/blog`);
    return comment;
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const userId = await syncUser(user);

    // Ensure user owns the comment
    const comment = await db.query.comments.findFirst({
        where: eq(comments.id, commentId)
    });

    if (!comment || comment.userId !== userId) {
        throw new Error('Unauthorized');
    }

    await db.delete(comments).where(eq(comments.id, commentId));
    revalidatePath(`/blog`);
}

export async function getComments(postId: string) {
    // Fetch comments with user details (mocking join for now or using separate query if needed)
    // For now, simpler query. Ideally we join with users table.
    
    // TODO: Join with users table for author name/avatar
    return await db.query.comments.findMany({
        where: eq(comments.postId, postId),
        orderBy: [desc(comments.createdAt)],
        with: {
            // Assuming relations are set up, but they might not be
            // If not, we might need to fetch manually or update schema relations
        }
    });
}
