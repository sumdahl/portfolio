import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { blogPosts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { BlogCard } from '@/components/blog/BlogCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles, tutorials, and thoughts on software development.',
};

export default async function BlogPage() {
  const posts = await db.query.blogPosts.findMany({
    where: eq(blogPosts.published, true),
    orderBy: [desc(blogPosts.createdAt)],
  });

  // Transform database posts to match BlogPost interface
  const transformedPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.createdAt.toISOString().split('T')[0],
    tags: post.tags,
    author: post.authorName,
    published: post.published,
    content: post.content,
    coverImage: post.coverImage,
    readingTime: Math.ceil(post.content.split(' ').length / 200),
  }));

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 space-y-4 relative">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Technical articles, tutorials, and thoughts on software development.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-accent text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transformedPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
