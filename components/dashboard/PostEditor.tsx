'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Save as SaveIcon, Type as TypeIcon, Link as LinkIcon, FileText as FileTextIcon, Image as ImageIcon, Tag as TagIcon, Send as SendIcon } from 'lucide-react';
import { notify } from '@/lib/utils/notifications';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import MarkdownEditor from '@/components/dashboard/MarkdownEditor';

import { Separator } from '@/components/ui/separator';

import { cleanSlug, generateSlug, sanitizeSlugInput } from '@/lib/utils/slug';
import { TagInput } from '@/components/dashboard/TagInput';
import { apiClient } from '@/lib/utils/api';
import { postSchema, type PostFormValues } from '@/lib/validations/post';

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
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      slug: initialData?.slug || '',
      tags: initialData?.tags || [],
      published: initialData?.published || false,
      coverImage: initialData?.coverImage || '',
    },
  });

  const { watch, setValue } = form;
  const title = watch('title');

  // Auto-generate slug from title if not manually edited
  useEffect(() => {
    if (!initialData?.id && !isSlugManuallyEdited && title) {
      setValue('slug', generateSlug(title), { shouldValidate: true });
    }
  }, [title, initialData?.id, isSlugManuallyEdited, setValue]);

  const onSubmit = async (data: PostFormValues) => {
    setLoading(true);
    try {
      const url = initialData?.id ? `/api/blog/${initialData.id}` : '/api/blog';

      if (initialData?.id) {
        await apiClient.put(url, data);
      } else {
        await apiClient.post(url, data);
      }

      notify.success(data.published ? 'Post published successfully' : 'Draft saved successfully');
      router.push('/dashboard/posts');
      router.refresh();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    setValue('published', true);
    form.handleSubmit(onSubmit as any)();
  };

  const handleSaveDraft = () => {
    setValue('published', false);
    form.handleSubmit(onSubmit as any)();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-primary" />
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter an engaging title..."
                        className="bg-background/50 border-input focus:border-primary/50 text-lg font-medium py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-primary" />
                      Short Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary for SEO and preview cards..."
                        rows={3}
                        className="bg-background/50 border-input focus:border-primary/50 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-4 w-4 text-primary" />
                        Main Content
                      </div>
                    </FormLabel>
                    <FormControl>
                      <MarkdownEditor
                        value={field.value}
                        onChange={(val) => field.onChange(val || '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

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
              <FormField
                control={form.control as any}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      URL Slug
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="post-url-slug"
                        className="bg-background/50 font-mono text-xs h-9"
                        {...field}
                        onChange={(e) => {
                          field.onChange(sanitizeSlugInput(e.target.value));
                          setIsSlugManuallyEdited(true);
                        }}
                        onBlur={() => field.onChange(cleanSlug(field.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image */}
              <FormField
                control={form.control as any}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      Cover Image
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormField
                control={form.control as any}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagInput tags={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                onClick={handlePublish}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                <SendIcon className="w-4 h-4 mr-2" />
                {loading ? 'Publishing...' : 'Publish Post'}
              </Button>
              <Button
                type="button"
                onClick={handleSaveDraft}
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
      </form>
    </Form>
  );
}
