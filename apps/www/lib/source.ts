import { docs, blog, projects as projectsSource, reading as readingSource, podcasts as podcastsSource } from 'collections/server';
import { LucideIcons } from '@/components/icons/lucide-icons';
import { attachFile } from '@/lib/attach-file';
import { attachSeparator } from '@/lib/attach-separator';
import AnimateUIIcon from '@workspace/ui/components/icons/animateui-icon';
import {
  loader,
  type InferMetaType,
  type InferPageType,
} from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { createElement } from 'react';

// Resolves the `icon` field of frontmatter / meta.json: a Lucide icon name,
// or one of the site's own icons.
function resolveIcon(icon: string | undefined) {
  if (!icon) return;
  if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  if (icon === 'AnimateUIIcon') return createElement(AnimateUIIcon);
  if (icon === 'LucideIcons') return createElement(LucideIcons);
}

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [attachFile, attachSeparator],
  icon: resolveIcon,
});

export const blogs = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blog, []),
});

export const projects = loader({
  baseUrl: '/projects',
  source: projectsSource.toFumadocsSource(),
  plugins: [attachFile, attachSeparator],
  icon: resolveIcon,
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

  const docsWithDate = source
    .getPages()
    .filter((page) => page.data.releaseDate)
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

export const reading = loader({
  baseUrl: '/reading',
  source: toFumadocsSource(readingSource, []),
});

// Helper to get reading posts sorted by date (newest first)
export const getSortedReadingPosts = () => {
  return reading
    .getPages()
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );
};

export const podcasts = loader({
  baseUrl: '/podcasts',
  source: toFumadocsSource(podcastsSource, []),
});

// Helper to get podcast posts sorted by date (newest first)
export const getSortedPodcastPosts = () => {
  return podcasts
    .getPages()
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );
};

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
export type BlogPage = InferPageType<typeof blogs>;
export type ProjectPage = InferPageType<typeof projects>;
export type ReadingPage = InferPageType<typeof reading>;
export type PodcastPage = InferPageType<typeof podcasts>;
