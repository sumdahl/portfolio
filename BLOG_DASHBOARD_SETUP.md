# Blog Dashboard Setup Guide

## 🚀 Quick Start

Your blog management dashboard is ready! Follow these steps to get it running:

### Step 1: Set Up Supabase Database

1. **Get your Supabase Database Password**:
   - Go to https://supabase.com/dashboard/project/zigukobiiafsnoswhbzk/settings/database
   - Copy your database password

2. **Update `.env.local`**:
   Replace `[YOUR-PASSWORD]` in the `DATABASE_URL` with your actual password:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.zigukobiiafsnoswhbzk.supabase.co:5432/postgres
   ```

### Step 2: Push Database Schema

Run this command to create the database tables:
```bash
bun run db:push
```

This will create:
- `blog_posts` table
- `blog_analytics` table  
- `users` table

### Step 3: Create Admin User

Create your admin account (use your desired password):
```bash
bun run create-admin YOUR_PASSWORD
```

Example:
```bash
bun run create-admin MySecurePassword123
```

This creates an admin user with:
- Email: `sumirandahal46@gmail.com`
- Password: Whatever you specified
- Role: `admin`

### Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
bun run dev
```

### Step 5: Access Dashboard

1. Go to http://localhost:3000/login
2. Login with your admin credentials
3. You'll be redirected to http://localhost:3000/dashboard

## 📝 Using the Dashboard

### Writing a New Blog Post

1. Go to `/dashboard/posts/new`
2. Fill in:
   - Title
   - Description
   - Content (use the rich text editor)
   - Tags
   - Cover image (optional)
3. Click "Save as Draft" or "Publish"

### Managing Posts

- View all posts at `/dashboard/posts`
- Edit existing posts
- Delete posts
- Toggle publish status

### Viewing Published Posts

- Public blog: http://localhost:3000/blog
- Individual post: http://localhost:3000/blog/[slug]

## 🔧 Troubleshooting

### Database Connection Error

If you see "DATABASE_URL environment variable is not set":
1. Check `.env.local` has the correct `DATABASE_URL`
2. Make sure you replaced `[YOUR-PASSWORD]` with actual password
3. Restart the dev server

### Login Not Working

1. Make sure you ran `bun run create-admin`
2. Check the email matches `ADMIN_EMAIL` in `.env.local`
3. Try the password you specified when creating the admin

### Tables Not Created

Run:
```bash
bun run db:push
```

To view your database in a GUI:
```bash
bun run db:studio
```

## 📚 API Routes

All blog API routes are protected and require admin authentication:

- `GET /api/blog` - List all posts
- `POST /api/blog` - Create new post
- `GET /api/blog/[id]` - Get single post
- `PUT /api/blog/[id]` - Update post
- `DELETE /api/blog/[id]` - Delete post

## 🎨 Next Steps

1. Customize the dashboard UI in `app/dashboard/`
2. Add more features (categories, comments, etc.)
3. Deploy to production (Vercel recommended)

---

**Need help?** Check the implementation plan for full technical details.
