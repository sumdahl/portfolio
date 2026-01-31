import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { eq } from 'drizzle-orm';
import { postSchema } from '@/lib/validations/post';

// GET - Fetch single blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT - Update blog post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, content, slug, tags, published, coverImage } = result.data;

    const updatedPost = await db
      .update(blogPosts)
      .set({
        title,
        description,
        content,
        slug,
        tags,
        published,
        coverImage,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!updatedPost.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deletedPost = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning();

    if (!deletedPost.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
