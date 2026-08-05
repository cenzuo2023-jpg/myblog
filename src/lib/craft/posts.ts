import { getCollectionItems } from './client';
import { mapToPost } from './mapper';
import type { Post } from './types';
import { parseISO, isValid } from 'date-fns';

let cachedPosts: Post[] | null = null;
let postsFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute memory cache in dev/build

export async function getAllPosts(): Promise<Post[]> {
  const now = Date.now();
  if (cachedPosts && now - postsFetchTime < CACHE_TTL) {
    return cachedPosts;
  }

  try {
    const rawItems = await getCollectionItems();
    const posts = rawItems
      .map(mapToPost)
      .filter((post: Post) => {
        // filter out invalid date items if any, but since some might be missing, 
        // we keep them but maybe with a default date
        if (!post.publishDate || post.publishDate === 'undefined') {
          return false; // Skip entirely empty items
        }
        return true;
      })
      .sort((a: Post, b: Post) => {
        const dateA = new Date(a.publishDate).getTime();
        const dateB = new Date(b.publishDate).getTime();
        // Sort descending
        return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      });

    // Check for duplicate slugs and warn
    const slugs = new Set<string>();
    for (const p of posts) {
      if (slugs.has(p.slug)) {
        console.warn(`[WARNING] Duplicate slug detected: ${p.slug}. This may cause routing issues.`);
      }
      slugs.add(p.slug);
    }

    cachedPosts = posts;
    postsFetchTime = now;
    return posts;
  } catch (error) {
    console.error('Failed to get posts:', error);
    return [];
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.published);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter(post => post.featured);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPublishedPosts();
  return posts.find(p => p.slug === slug);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter(p => p.tags.includes(tag));
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const tagCount: Record<string, number> = {};
  
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }
  }

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getAdjacentPosts(slug: string): Promise<{ prev: Post | null, next: Post | null }> {
  const posts = await getPublishedPosts();
  const index = posts.findIndex(p => p.slug === slug);
  
  if (index === -1) {
    return { prev: null, next: null };
  }

  // Next post is index - 1 (because sorted descending, newer is smaller index)
  // Prev post is index + 1
  return {
    next: index > 0 ? posts[index - 1] : null,
    prev: index < posts.length - 1 ? posts[index + 1] : null,
  };
}
