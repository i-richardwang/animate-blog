import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteLayoutProps } from '@/lib/site-layout';
import { getSortedBlogPosts } from '@/lib/source';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

// Build page tree sorted by date (newest first)
const blogTree: PageTree.Root = {
  name: 'Blog',
  children: getSortedBlogPosts().map((post) => ({
    type: 'page',
    name: post.data.title,
    url: post.url,
  })),
};

const BLOG_LAYOUT_PROPS = siteLayoutProps(blogTree);

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout {...BLOG_LAYOUT_PROPS}>{children}</DocsLayout>
    </>
  );
}
