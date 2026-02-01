import { pgTable, text, timestamp, boolean, uuid, integer, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
  published: boolean('published').notNull().default(false),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull().default('Sumiran Dahal'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const blogAnalytics = pgTable('blog_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }).unique(),
  views: integer('views').notNull().default(0),
  likes: integer('likes').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  deliveryStatus: text('delivery_status').notNull().default('pending'),
  resendId: text('resend_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  postId: uuid('post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // Nullable for anonymous
  authorName: text('author_name').notNull().default('Anonymous'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const postLikes = pgTable('post_likes', {
  id: uuid('id').defaultRandom().primaryKey(), // Surrogate key easier for interaction
  postId: uuid('post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // Nullable
  sessionId: text('session_id'), // For anonymous tracking
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
// Removing composite PK to allow flexible unique constraints if needed, but for now simple surrogate + logic check


export type User = typeof users.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type BlogAnalytics = typeof blogAnalytics.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type PostLike = typeof postLikes.$inferSelect;
export type NewPostLike = typeof postLikes.$inferInsert;
