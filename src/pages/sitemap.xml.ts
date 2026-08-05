import { getLocalePath } from '../config/i18n';
import { localizedEntryPath, getLocalizedEntries } from '../lib/content/entries';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET({ site, url }: { site?: URL; url: URL }) {
  const origin = (site?.origin || url.origin).replace(/\/$/, '');
  const posts = await getLocalizedEntries('posts', 'zh-cn');

  const staticPaths = [
    getLocalePath('zh-cn', '/'),
    getLocalePath('zh-cn', '/posts/'),
    getLocalePath('zh-cn', '/archives/'),
    getLocalePath('zh-cn', '/rss.xml')
  ];

  const postPaths = posts.map((entry) => localizedEntryPath('posts', entry as any));
  const urls = [...new Set([...staticPaths, ...postPaths])]
    .map((path) => `<url><loc>${escapeXml(`${origin}${path}`)}</loc></url>`)
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      'content-type': 'application/xml; charset=utf-8'
    }
  });
}
