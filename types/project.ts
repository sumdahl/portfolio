export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  challenges?: string[];
  learnings?: string[];
  date: string;
}
