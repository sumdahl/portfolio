import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Eye, Edit3, Sparkles, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/date';

export default async function DashboardPage() {
  const [totalPosts] = await db.select({ count: count() }).from(blogPosts);
  const [publishedPosts] = await db
    .select({ count: count() })
    .from(blogPosts)
    .where(eq(blogPosts.published, true));

  const recentPosts = await db.query.blogPosts.findMany({
    limit: 5,
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back. Here&apos;s what&apos;s happening with your blog today.
          </p>
        </div>
        <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
          <Link href="/dashboard/posts/new" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New CMS Post
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/10 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-24 h-24" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPosts.count}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime posts created</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/10 bg-green-500/5 backdrop-blur-sm hover:bg-green-500/10 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye className="w-24 h-24 text-green-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{publishedPosts.count}</div>
            <p className="text-xs text-muted-foreground mt-1">Live for the world to see</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/10 bg-yellow-500/5 backdrop-blur-sm hover:bg-yellow-500/10 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Edit3 className="w-24 h-24 text-yellow-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit3 className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPosts.count - publishedPosts.count}</div>
            <p className="text-xs text-muted-foreground mt-1">Ideas in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-full md:col-span-7 border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest content updates and publication status.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/posts" className="text-primary hover:text-primary/80">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between group p-3 rounded-xl border border-transparent hover:border-border/50 hover:bg-secondary/50 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${post.published ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                      {post.published ? <Sparkles className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1">
                      <Link href={`/dashboard/posts/${post.id}/edit`} className="font-semibold text-foreground hover:text-primary transition-colors block">
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal border-border/50">
                          {post.published ? 'Article' : 'Draft'}
                        </Badge>
                        <span>•</span>
                        <span>{formatDate(post.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={post.published ? "default" : "secondary"} className={`${post.published ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'} transition-all`}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                    <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Edit3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {recentPosts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No recent activity found. Start writing your first post!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
