import xss from 'xss';
import { marked } from 'marked';

export async function renderCraftBlocks(blocks: any[]): Promise<string> {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  const rawMarkdown = extractMarkdown(blocks);
  const rawHtml = await marked.parse(rawMarkdown, { async: true });
  
  return xss(rawHtml, {
    whiteList: {
      ...xss.whiteList,
      img: ['src', 'alt', 'width', 'height', 'loading'],
      a: ['href', 'title', 'target', 'rel'],
      span: ['class', 'style'],
      div: ['class', 'style']
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
}

function extractMarkdown(blocks: any[], level = 0): string {
  let md = '';
  for (const block of blocks) {
    if (block.markdown) {
      let text = block.markdown;
      
      // Basic translation of craft specific tags
      text = text.replace(/<highlight color="([^"]*)">(.*?)<\/highlight>/g, '<span style="background-color: var(--color-highlight-$1)">$2</span>');
      text = text.replace(/==(.*?)==/g, '<mark>$1</mark>');
      text = text.replace(/<callout>(.*?)<\/callout>/g, '> $1');
      text = text.replace(/<caption>(.*?)<\/caption>/g, '<em>$1</em>');
      text = text.replace(/<page[^>]*>([\s\S]*?)<\/page>/g, '$1');
      text = text.replace(/<content>([\s\S]*?)<\/content>/g, '$1');
      text = text.replace(/<pageTitle>(.*?)<\/pageTitle>/g, '## $1');

      // indent for nesting
      if (level > 0 && block.type !== 'page') {
        text = text.split('\n').map((line: string) => ' '.repeat(level * 2) + line).join('\n');
      }

      md += text + '\n\n';
    }
    if (block.content && Array.isArray(block.content)) {
      md += extractMarkdown(block.content, level + 1);
    }
  }
  return md;
}
