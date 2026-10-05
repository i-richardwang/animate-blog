import {
  docs,
  blog,
  projects as projectsSource,
  reading as readingSource,
  podcasts as podcastsSource,
} from 'collections/server';
import { attachFile } from '@/lib/attach-file';
import { loader, type InferPageType } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { createElement } from 'react';

// Resolves the icon names of meta.json separators (`---[Icon]Name---`)
// to Lucide icons.
function resolveIcon(icon: string | undefined) {
  if (icon && icon in icons) {
    return createElement(icons[icon as keyof typeof icons]);
  }
}

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [attachFile],
  icon: resolveIcon,
});

export const blogs = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blog, []),
});

export const projects = loader({
  baseUrl: '/projects',
  source: projectsSource.toFumadocsSource(),
});

export const reading = loader({
  baseUrl: '/reading',
  source: toFumadocsSource(readingSource, []),
});

export const podcasts = loader({
  baseUrl: '/podcasts',
  source: toFumadocsSource(podcastsSource, []),
});

export type Page = InferPageType<typeof source>;

const byDateDesc = <T extends { data: { date: Date } }>(pages: T[]) =>
  pages.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const getSortedBlogPosts = () => byDateDesc(blogs.getPages());
export const getSortedReadingPosts = () => byDateDesc(reading.getPages());
export const getSortedPodcastPosts = () => byDateDesc(podcasts.getPages());

// Projects in the order content/projects/meta.json lists them.
export const getOrderedProjects = () =>
  projects.pageTree.children.flatMap((node) => {
    const page = node.type === 'page' && projects.getNodePage(node);
    return page ? [page] : [];
  });

export type PageLink = { name: string; url: string };

// The pages before and after `url` in an ordered list, for prev/next links.
export function getNeighbours(
  pages: { url: string; data: { title: string } }[],
  url: string,
): { previous?: PageLink; next?: PageLink } {
  const index = pages.findIndex((page) => page.url === url);
  const link = (page?: (typeof pages)[number]) =>
    page && { name: page.data.title, url: page.url };
  return { previous: link(pages[index - 1]), next: link(pages[index + 1]) };
}

export type LatestEntry = { title: string; url: string };

// The newest blog posts and dated notes, for the home page.
export const getLatestContent = (limit: number): LatestEntry[] => {
  const dated = [
    ...blogs.getPages().map((post) => ({ page: post, date: post.data.date })),
    ...source
      .getPages()
      .flatMap((page) =>
        page.data.releaseDate ? [{ page, date: page.data.releaseDate }] : [],
      ),
  ];

  return dated
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit)
    .map(({ page }) => ({ title: page.data.title, url: page.url }));
};
