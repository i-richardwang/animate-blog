import { docs, blog, projects as projectsSource } from '@/.source';
import { LucideIcons } from '@/components/icons/lucide-icons';
import { attachFile } from '@/lib/attach-file';
import { attachSeparator } from '@/lib/attach-separator';
import AnimateUIIcon from '@workspace/ui/components/icons/animateui-icon';
import {
  loader,
  type InferMetaType,
  type InferPageType,
} from 'fumadocs-core/source';
import type { PageTree } from 'fumadocs-core/server';
import { createMDXSource } from 'fumadocs-mdx';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// Directories to exclude (Animate UI original documentation)
const EXCLUDED_PATHS = ['components', 'icons', 'primitives'];
// Root-level single pages to exclude from docs
const EXCLUDED_ROOT_PAGES = new Set([
  'changelog',
  'roadmap',
  'other-animated-distributions',
  'troubleshooting',
  'mcp',
  'installation',
  'accessibility',
]);

// Base docs source from Fumadocs
const rawSource = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  pageTree: {
    attachFile,
    attachSeparator,
  },
  icon(icon) {
    if (!icon) return;
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
    if (icon === 'AnimateUIIcon') return createElement(AnimateUIIcon);
    if (icon === 'LucideIcons') return createElement(LucideIcons);
  },
});

// Helpers for exclusion checks
function isExcludedUrl(url: string): boolean {
  // Expect url like "/docs/..."; keep root "/docs"
  if (!url.startsWith('/docs')) return false;
  const rest = url.replace('/docs/', '');
  const segments = rest.split('/');
  const firstSegment = segments[0] ?? '';
  if (EXCLUDED_PATHS.includes(firstSegment)) return true;
  // root-only pages
  const isRootPage = (segments.filter(Boolean).length === 1);
  return isRootPage && EXCLUDED_ROOT_PAGES.has(firstSegment);
}

function isExcludedSlugs(slugs?: string[]): boolean {
  if (!slugs || slugs.length === 0) return false;
  const first = slugs[0] ?? '';
  if (EXCLUDED_PATHS.includes(first)) return true;
  return slugs.length === 1 && EXCLUDED_ROOT_PAGES.has(first);
}

function filterTreeNodes(nodes: PageTree.Node[]): PageTree.Node[] {
  const result: PageTree.Node[] = [];
  for (const node of nodes) {
    // page nodes with url property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyNode = node as any;
    const url: string | undefined = anyNode?.url;

    if (url && isExcludedUrl(url)) {
      continue;
    }

    if ('children' in node && Array.isArray((node as PageTree.Folder).children)) {
      const folder = node as PageTree.Folder;
      const children = filterTreeNodes(folder.children ?? []);
      if (children.length === 0) {
        // drop empty folders
        continue;
      }
      result.push({ ...folder, children });
      continue;
    }

    result.push(node);
  }
  return result;
}

function filterPageTreeRoot(root: PageTree.Root): PageTree.Root {
  return { ...root, children: filterTreeNodes(root.children) };
}

// Filtered docs source that hides excluded sections from routes, sidebar, SSG and search
export const source = {
  ...rawSource,
  // internal helper to reuse the same filtering logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getFilteredPages(locale?: string) {
    return rawSource
      .getPages(locale as never)
      .filter((p) => !isExcludedUrl(p.url));
  },
  getPages(locale?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (source as any)._getFilteredPages(locale);
  },
  getPage(slugs?: string[], locale?: string) {
    if (isExcludedSlugs(slugs)) return undefined as never;
    const page = rawSource.getPage(slugs as never, locale as never);
    if (!page) return undefined as never;
    return isExcludedUrl(page.url) ? (undefined as never) : page;
  },
  getPageTree(locale?: string) {
    const root = rawSource.getPageTree(locale as never) as unknown as PageTree.Root;
    return filterPageTreeRoot(root) as never;
  },
  generateParams(locale?: string) {
    // Build params from filtered pages to ensure excluded routes are not prerendered
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pages = (source as any)._getFilteredPages(locale) as Array<{
      url: string;
    }>;
    const params = pages.map((p) => {
      const rest = p.url.replace('/docs', '').replace(/^\//, '');
      const parts = rest.length > 0 ? rest.split('/') : [];
      // Always return { slug: [...] } even for root to ensure OG routes work
      return { slug: parts };
    });
    type ParamsReturn = ReturnType<typeof rawSource.generateParams>;
    return params as unknown as ParamsReturn;
  },
  // Keep pageTree in sync with filter (non-i18n)
  pageTree: filterPageTreeRoot(rawSource.pageTree as unknown as PageTree.Root),
} as typeof rawSource;

export const blogs = loader({
  baseUrl: '/blog',
  source: createMDXSource(blog),
});

export const projects = loader({
  baseUrl: '/projects',
  source: projectsSource.toFumadocsSource(),
  pageTree: {
    attachFile,
    attachSeparator,
  },
  icon(icon) {
    if (!icon) return;
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
    if (icon === 'AnimateUIIcon') return createElement(AnimateUIIcon);
    if (icon === 'LucideIcons') return createElement(LucideIcons);
  },
});

// Helper to get blog posts sorted by date (newest first)
export const getSortedBlogPosts = () => {
  return blogs
    .getPages()
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );
};

// Helper to get latest content (blogs + docs with releaseDate) sorted by date
export const getLatestContent = (limit: number = 3) => {
  // Get all blog posts
  const blogPosts = blogs.getPages().map((post) => ({
    title: post.data.title,
    url: post.url,
    date: new Date(post.data.date),
    type: 'blog' as const,
  }));

  // Get all docs with releaseDate, excluding certain directories
  const docsWithDate = source
    .getPages()
    .filter((page) => {
      // Filter out excluded directories
      const pathSegments = page.url.replace('/docs/', '').split('/');
      const firstSegment = pathSegments[0];
      if (EXCLUDED_PATHS.includes(firstSegment)) return false;

      // Only include pages with releaseDate
      return page.data.releaseDate;
    })
    .map((page) => ({
      title: page.data.title,
      url: page.url,
      date: new Date(page.data.releaseDate!),
      type: 'docs' as const,
    }));

  // Combine and sort by date (newest first)
  const allContent = [...blogPosts, ...docsWithDate].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  // Return top N items
  return allContent.slice(0, limit);
};

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
export type BlogPage = InferPageType<typeof blogs>;
export type ProjectPage = InferPageType<typeof projects>;
