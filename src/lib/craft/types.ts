export interface CraftCollectionItem {
  id: string;
  title: string;
  properties: Record<string, any>;
  content?: any[]; // For now we keep it any
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  publishDate: string; // ISO format or valid date string
  tags: string[];
  published: boolean;
  featured: boolean;
  coverImage?: string;
  content: any[]; // The raw Craft blocks
}
