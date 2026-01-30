import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/dashboard/PostEditor';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, id),
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-body">Edit Post</h1>
        <p className="text-accent mt-2">Update your blog post</p>
      </div>
      <PostEditor
        initialData={{
          id: post.id,
          title: post.title,
          description: post.description,
          content: post.content,
          slug: post.slug,
          tags: post.tags,
          published: post.published,
          coverImage: post.coverImage || undefined,
        }}
      />
    </div>
  );
}
