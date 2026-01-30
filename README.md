# Modern Developer Portfolio

A TypeScript-first portfolio website built with Next.js 16, featuring a custom MDX blog system, GitHub integration, and dark-mode-first design.

## 🚀 Features

- **Modern Tech Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Bun runtime
- **Custom MDX Blog**: Write and publish blog posts with syntax highlighting and live preview
- **GitHub Integration**: Display contribution heatmap and featured repositories via GraphQL API
- **Dark Mode First**: Carefully crafted color palette optimized for readability
- **Fully Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Comprehensive metadata, OpenGraph, and Twitter cards
- **Analytics**: Privacy-friendly Umami analytics integration
- **Accessible**: WCAG compliant with keyboard navigation support

## 🎨 Color Palette

| Color | Role | Hex |
|-------|------|-----|
| Primary Background | Dark mode base | `#293241` |
| Body/Headings | High contrast text | `#E0FBFC` |
| Secondary/Cards | Card backgrounds | `#3D5A80` |
| Action | Buttons/CTAs | `#EE6C4D` |
| Accent/Links | Highlights | `#98C1D9` |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/sumdahl/portfolio.git
cd portfolio_website

# Install dependencies with Bun
bun install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
bun dev
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# GitHub API (Required for contribution heatmap)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=sumdahl

# Supabase (Optional - for dynamic blog storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Umami Analytics (Optional)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_website_id
NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js
```

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `read:user` scope
3. Add to `.env.local` as `GITHUB_TOKEN=your_token_here`

## 📁 Project Structure

```
portfolio_website/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── blog/              # Blog listing and posts
│   ├── contact/           # Contact page
│   ├── projects/          # Projects page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── blog/             # Blog components
│   ├── github/           # GitHub integration
│   ├── home/             # Home page components
│   ├── layout/           # Layout components
│   ├── projects/         # Project components
│   ├── shared/           # Shared components
│   └── ui/               # shadcn/ui components
├── content/              # Content files
│   ├── blog/            # MDX blog posts
│   └── projects/        # Project data
├── lib/                  # Utility functions
│   ├── github.ts        # GitHub API client
│   ├── mdx.ts           # MDX utilities
│   └── utils.ts         # Shared utilities
├── styles/              # Global styles
├── types/               # TypeScript types
└── public/              # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Add the same environment variables from `.env.local` to your Vercel project settings.

## 📝 Adding Blog Posts

Create a new MDX file in `content/blog/`:

```mdx
---
title: "Your Post Title"
description: "Brief description"
date: "2026-01-30"
tags: ["TypeScript", "Next.js"]
author: "Sumiran Dahal"
published: true
---

# Your Content Here

Write your blog post content using MDX...
```

## 🎯 Adding Projects

Edit `content/projects/index.ts` to add your projects:

```typescript
{
  id: '1',
  title: 'Project Name',
  description: 'Short description',
  techStack: ['TypeScript', 'React'],
  githubUrl: 'https://github.com/...',
  liveUrl: 'https://...',
  featured: true,
  date: '2026-01-30',
}
```

## 🧪 Scripts

```bash
# Development
bun dev

# Build for production
bun run build

# Start production server
bun start

# Lint
bun run lint

# Type check
bun run type-check
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Blog**: MDX with syntax highlighting
- **GitHub API**: @octokit/graphql
- **Analytics**: Umami
- **Runtime**: Bun

## 📄 License

MIT License - feel free to use this project as a template for your own portfolio!

## 🤝 Contact

- **Email**: sumirandahal46@gmail.com
- **GitHub**: [@sumdahl](https://github.com/sumdahl)
- **LinkedIn**: [Sumiran Dahal](https://www.linkedin.com/in/sumiran-dahal-108285220/)
- **Twitter**: [@sumiran_dahal](https://x.com/sumiran_dahal)

---

Built with ❤️ by Sumiran Dahal
