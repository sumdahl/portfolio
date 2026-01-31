'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save as SaveIcon, Eye as EyeIcon, X, Type as TypeIcon, Link as LinkIcon, FileText as FileTextIcon, Image as ImageIcon, Tag as TagIcon, Send as SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { Typography } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';

import { cleanSlug, generateSlug, sanitizeSlugInput } from '@/lib/utils/slug';
import { TagInput } from '@/components/dashboard/TagInput';
import { apiClient } from '@/lib/utils/api';

interface PostEditorProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    content: string;
    slug: string;
    tags: string[];
    published: boolean;
    coverImage?: string;
  };
}

export function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [showPreview, setShowPreview] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Auto-generate slug from title if not manually edited
  // generateSlug is now imported from utils


  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initialData?.id && !isSlugManuallyEdited) {
      // Only auto-update slug if creating new and slug hasn't been manually edited
      setSlug(generateSlug(value));
    }
  };





  const handleSave = async (publishNow: boolean) => {
    if (!title || !description || !content || !slug) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data = {
        title,
        description,
        coverImage,
        content,
        slug,
        tags,
        published: publishNow,
      };

      const url = initialData?.id ? `/api/blog/${initialData.id}` : '/api/blog';

      if (initialData?.id) {
        await apiClient.put(url, data);
      } else {
        await apiClient.post(url, data);
      }

      toast.success(publishNow ? 'Post published successfully' : 'Draft saved successfully');
      router.push('/dashboard/posts');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content Area - 2 Columns on Desktop */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden group">
          <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary/50" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-primary" />
              <span className="text-foreground">Content Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TypeIcon className="h-4 w-4 text-primary" />
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter an engaging title..."
                className="bg-background/50 border-input focus:border-primary/50 text-lg font-medium py-6"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-primary" />
                Short Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary for SEO and preview cards..."
                rows={3}
                className="bg-background/50 border-input focus:border-primary/50 resize-none"
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4 text-primary" />
                  Main Content
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="h-8 text-muted-foreground hover:text-primary-foreground hover:bg-primary transition-all duration-300"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  {showPreview ? 'Edit Markdown' : 'Preview Mode'}
                </Button>
              </div>

              {showPreview ? (
                <div className="prose prose-invert max-w-none bg-background/50 p-6 rounded-lg border border-border/50 min-h-[400px]">
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                </div>
              ) : (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Write your masterpiece here...\n\nMarkdown is supported!"
                  rows={20}
                  className="bg-background/50 border-input focus:border-primary/50 font-mono text-sm leading-relaxed"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Meta Info - 1 Column on Desktop */}
      {/* Sidebar - Meta Info - 1 Column on Desktop */}
      <div className="space-y-6">
        {/* Meta Data Card */}
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-primary" />
              Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                URL Slug
              </label>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlug(sanitizeSlugInput(e.target.value));
                  setIsSlugManuallyEdited(true);
                }}
                onBlur={() => setSlug(cleanSlug(slug))}
                placeholder="post-url-slug"
                className="bg-background/50 font-mono text-xs h-9"
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Cover Image
              </label>
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
                disabled={loading}
              />
            </div>

            {/* Tags */}
            <TagInput tags={tags} onChange={setTags} />
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              type="button"
              onClick={() => handleSave(true)}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              <SendIcon className="w-4 h-4 mr-2" />
              {loading ? 'Publishing...' : 'Publish Post'}
            </Button>
            <Button
              type="button"
              onClick={() => handleSave(false)}
              disabled={loading}
              variant="outline"
              className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Separator className="my-2 bg-border/50" />
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="w-full text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
            >
              Discard Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
