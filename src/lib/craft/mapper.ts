import type { CraftCollectionItem, Post } from './types';
import { craftFields } from './config';
import slugify from 'slugify';

export function mapToPost(item: CraftCollectionItem): Post {
  const props = item.properties || {};

  const title = item.title || 'Untitled';
  
  // Try to use explicit slug field if mapped and present, otherwise generate from title
  let slug = '';
  if (craftFields.slug && props[craftFields.slug]) {
    slug = String(props[craftFields.slug]);
  } else {
    slug = slugify(title, { lower: true, strict: true, locale: 'zh' });
    if (!slug) slug = item.id; // fallback for titles that can't be slugified
  }

  const summary = (craftFields.summary && props[craftFields.summary]) ? String(props[craftFields.summary]) : '';
  let publishDate = new Date().toISOString();
  if (craftFields.publishDate && props[craftFields.publishDate]) {
    const rawDate = String(props[craftFields.publishDate]);
    if (!isNaN(new Date(rawDate).getTime())) {
      publishDate = new Date(rawDate).toISOString();
    }
  }
  // Tags might be an array or string depending on Craft
  let tags: string[] = [];
  if (craftFields.tags && props[craftFields.tags]) {
    const rawTags = props[craftFields.tags];
    if (Array.isArray(rawTags)) {
      tags = rawTags.map(String);
    } else if (typeof rawTags === 'string') {
      tags = rawTags.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  // Published logic: if field exists, use it. Otherwise assume true if there's a title.
  let published = true;
  if (craftFields.published && props[craftFields.published] !== undefined) {
    published = Boolean(props[craftFields.published]);
  }

  let featured = false;
  if (craftFields.featured && props[craftFields.featured] !== undefined) {
    featured = Boolean(props[craftFields.featured]);
  }

  let coverImage = undefined;
  if (craftFields.coverImage && props[craftFields.coverImage]) {
    coverImage = String(props[craftFields.coverImage]);
  }

  return {
    id: item.id,
    title,
    slug,
    summary,
    publishDate,
    tags,
    published,
    featured,
    coverImage,
    content: item.content || []
  };
}
