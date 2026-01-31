import * as z from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .max(100, {
      message: 'Title must be less than 100 characters.',
    }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.',
    })
    .max(300, {
      message: 'Description must be less than 300 characters.',
    }),
  slug: z
    .string()
    .min(2, {
      message: 'Slug must be at least 2 characters.',
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be kebab-case (lowercase letters, numbers, and hyphens only).',
    }),
  content: z.string().min(1, {
    message: 'Content is required.',
  }),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export type PostFormValues = z.infer<typeof postSchema>;
