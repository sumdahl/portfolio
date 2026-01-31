import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { BlogPost, BlogFrontmatter } from '@/types/blog';
import { generateSlug } from '@/lib/utils/slug';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Ensure blog directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.mdx', '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as BlogFrontmatter;

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      content,
      date: frontmatter.date,
      tags: frontmatter.tags || [],
      author: frontmatter.author || 'Sumiran Dahal',
      readingTime: Math.ceil(readingTime(content).minutes),
      coverImage: frontmatter.coverImage,
      published: frontmatter.published ?? true,
    };
  });

  // Sort by date (newest first)
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as BlogFrontmatter;

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      content,
      date: frontmatter.date,
      tags: frontmatter.tags || [],
      author: frontmatter.author || 'Sumiran Dahal',
      readingTime: Math.ceil(readingTime(content).minutes),
      coverImage: frontmatter.coverImage,
      published: frontmatter.published ?? true,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export function extractHeadings(content: string) {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[0].indexOf(' ');
    const text = match[1];
    const id = generateSlug(text);

    headings.push({ level, text, id });
  }

  return headings;
}

export function getRelatedPosts(currentSlug: string, currentTags: string[], allPosts: BlogPost[], limit = 3): BlogPost[] {
  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const commonTags = post.tags.filter((tag) => currentTags.includes(tag));
      return { post, score: commonTags.length };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
