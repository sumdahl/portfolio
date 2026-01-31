'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/date';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/types/blog';
import Image from 'next/image';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  const formattedDate = formatDate(post.date, { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <Card className="h-full flex flex-col bg-card border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden group">
          <div className="relative w-full aspect-video overflow-hidden bg-muted">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-muted-foreground">
                <span className="text-4xl">📄</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          <CardHeader className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1">
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
              {post.description}
            </p>
          </CardContent>

          <CardFooter className="pt-4 mt-auto border-t border-border/50">
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground/80">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
