export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  type?: string; // Added type
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  features?: string[]; // Added features
  challenges?: string[];
  learnings?: string[];
  date: string;
}
