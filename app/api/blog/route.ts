import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { desc } from 'drizzle-orm';

// GET - Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    let posts;
    if (published === 'true') {
      posts = await db.query.blogPosts.findMany({
        where: (blogPosts, { eq }) => eq(blogPosts.published, true),
        orderBy: [desc(blogPosts.createdAt)],
      });
    } else {
      posts = await db.query.blogPosts.findMany({
        orderBy: [desc(blogPosts.createdAt)],
      });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
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
    const { title, description, content, slug, tags, published, coverImage } = body;

    if (!title || !description || !content || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = await db
      .insert(blogPosts)
      .values({
        title,
        description,
        content,
        slug,
        tags: tags || [],
        published: published || false,
        coverImage,
        authorId: user.id,
        authorName: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
      })
      .returning();

    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
