export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  tags: string[];
  author: string;
  readingTime: number;
  coverImage?: string | null;
  published: boolean;
}

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  coverImage?: string;
  published: boolean;
}

export interface BlogFrontmatter extends BlogMetadata {
  slug?: string;
}
