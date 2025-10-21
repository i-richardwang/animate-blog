import { docs, blog, project } from '@/.source';
import { LucideIcons } from '@/components/icons/lucide-icons';
import { attachFile } from '@/lib/attach-file';
import { attachSeparator } from '@/lib/attach-separator';
import AnimateUIIcon from '@workspace/ui/components/icons/animateui-icon';
import {
  loader,
  type InferMetaType,
  type InferPageType,
} from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// Directories to exclude (Animate UI original documentation)
const EXCLUDED_PATHS = ['components', 'icons', 'primitives'];

export const source = loader({
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

export const blogs = loader({
  baseUrl: '/blog',
  source: createMDXSource(blog),
});

export const projects = loader({
  baseUrl: '/projects',
  source: createMDXSource(project),
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

// Helper to get projects sorted by date (newest first)
export const getSortedProjects = () => {
  return projects
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
