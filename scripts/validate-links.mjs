/**
 * Validate internal links in MDX content files.
 * Checks that all internal page links point to existing content.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');

const STATIC_ROUTES = ['/', '/about', '/blog', '/docs', '/projects', '/reading'];
const ASSET_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.pdf', '.mp4', '.webm'];

function findFiles(dir, ext, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) findFiles(fullPath, ext, files);
    else if (entry.name.endsWith(ext)) files.push(fullPath);
  }
  return files;
}

function getValidUrls() {
  const urls = new Set(STATIC_ROUTES);
  
  const sources = [
    { dir: 'content/docs', prefix: '/docs', nested: true },
    { dir: 'content/blogs', prefix: '/blog', nested: false },
    { dir: 'content/projects', prefix: '/projects', nested: false },
    { dir: 'content/reading', prefix: '/reading', nested: false },
  ];

  for (const { dir, prefix, nested } of sources) {
    const baseDir = path.join(ROOT_DIR, dir);
    for (const file of findFiles(baseDir, '.mdx')) {
      const slug = nested
        ? path.relative(baseDir, file).replace(/\.mdx$/, '').replace(/\/index$/, '')
        : path.basename(file, '.mdx');
      urls.add(slug === 'index' ? prefix : `${prefix}/${slug}`);
    }
  }
  return urls;
}

function extractLinks(content) {
  const links = [];
  for (const [, text, url] of content.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) {
    links.push({ url, text });
  }
  for (const [, url] of content.matchAll(/href=["']([^"']+)["']/g)) {
    links.push({ url, text: '' });
  }
  return links;
}

function isInternalPageLink(url) {
  if (!url?.startsWith('/')) return false;
  if (/^(https?:|mailto:|tel:|#|\/api\/)/.test(url)) return false;
  return !ASSET_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext));
}

function validateLinks() {
  const validUrls = getValidUrls();
  const brokenLinks = [];

  for (const file of findFiles(CONTENT_DIR, '.mdx')) {
    const content = fs.readFileSync(file, 'utf-8');
    const relPath = path.relative(ROOT_DIR, file);
    
    for (const { url, text } of extractLinks(content)) {
      if (isInternalPageLink(url)) {
        const normalized = url.split('#')[0].split('?')[0];
        if (!validUrls.has(normalized)) {
          brokenLinks.push({ file: relPath, url, text });
        }
      }
    }
  }

  console.log(`Scanned ${validUrls.size} valid URLs\n`);

  if (!brokenLinks.length) {
    console.log('No broken internal links found!');
    return;
  }

  console.log(`Found ${brokenLinks.length} broken link(s):\n`);
  
  const byFile = Object.groupBy(brokenLinks, l => l.file);
  for (const [file, links] of Object.entries(byFile)) {
    console.log(`${file}`);
    for (const { url, text } of links) {
      console.log(`  - ${url}${text ? ` ("${text}")` : ''}`);
    }
  }
  
  process.exit(1);
}

validateLinks();
