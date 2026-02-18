import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/date';
import { PlusCircle, Edit, Calendar, Hash, Globe, EyeOff, LayoutTemplate } from 'lucide-react';
import { DeletePostButton } from '@/components/dashboard/DeletePostButton';
import { Typography } from '@/components/ui/typography';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const posts = await db.query.blogPosts.findMany({
    orderBy: [desc(blogPosts.createdAt)],
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Blog Posts</h2>
          <Typography.Muted className="text-lg mt-1">Manage and organize your content library.</Typography.Muted>
        </div>
        <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
          <Link href="/dashboard/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New CMS Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card className="p-16 bg-card/50 backdrop-blur-sm border-dashed border-2 border-border/50 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <LayoutTemplate className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-1">
              <Typography.H3>No posts yet</Typography.H3>
              <Typography.Muted>Get started by creating your first blog post.</Typography.Muted>
            </div>
            <Button asChild className="mt-4">
              <Link href="/dashboard/posts/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            </Button>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <Badge
                        variant={post.published ? 'default' : 'secondary'}
                        className={`capitalize px-2.5 py-0.5 ${post.published
                          ? 'bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20'
                          : 'bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25 border-yellow-500/20'}`}
                      >
                        <div className="flex items-center gap-1.5">
                          {post.published ? <Globe className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {post.published ? 'Published' : 'Draft'}
                        </div>
                      </Badge>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/80">
                      <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 opacity-70" />
                          <span className="truncate max-w-[300px]">{post.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center md:flex-col justify-end gap-3 mt-4 md:mt-0 md:border-l md:border-border/50 md:pl-6 w-full md:w-auto">
                    <Button asChild variant="outline" size="sm" className="flex-1 md:flex-none justify-center md:justify-start gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors">
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="md:hidden lg:inline">Edit</span>
                      </Link>
                    </Button>
                    <div className="flex-1 md:w-full">
                      <DeletePostButton postId={post.id} className="w-full justify-center md:justify-start" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
