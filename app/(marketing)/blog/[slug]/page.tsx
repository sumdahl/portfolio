import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/date';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMDXComponents } from '@/components/blog/MDXComponents';
import 'highlight.js/styles/github-dark.css';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, slug),
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: [post.authorName],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, slug),
  });

  if (!post || !post.published) {
    notFound();
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <article className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-accent hover:text-accent/80 mb-8 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {/* Hero Image */}
        {post.coverImage && (
          <div className="relative w-full aspect-video mb-10 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight max-w-4xl mx-auto">{post.title}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">{post.description}</p>



          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground border-t border-b border-border py-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarImage src="/images/profile/profile-sm.jpg" alt={post.authorName} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {post.authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-medium text-foreground">{post.authorName}</span>
                <div className="flex items-center gap-2 text-xs">
                  <time dateTime={post.createdAt.toISOString()}>
                    {formatDate(post.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </time>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-a:text-primary hover:prose-a:text-primary/80 transition-colors">
          <MDXRemote
            source={post.content}
            components={getMDXComponents()}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeHighlight,
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    {
                      behavior: 'wrap',
                      properties: {
                        className: ['anchor'],
                      },
                    },
                  ],
                ],
              },
            }}
          />
        </div>

      </div>
    </article>
  );
}
