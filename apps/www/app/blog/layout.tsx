import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import { getSortedBlogPosts } from '@/lib/source';
import type { PageTree } from 'fumadocs-core/server';
import { DocsSidebar } from '@/components/docs/sidebar';
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

const BLOG_LAYOUT_PROPS: DocsLayoutProps = {
  tree: blogTree,
  githubUrl: 'https://github.com/i-richardwang/animate-blog',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout
        {...BLOG_LAYOUT_PROPS}
        nav={{
          component: <Nav />,
        }}
        sidebar={{
          enabled: false,
        }}
      >
        {children}
      </DocsLayout>
      {/* Mobile-only sidebar overlay for Blog routes */}
      <DocsSidebar {...BLOG_LAYOUT_PROPS} />
    </>
  );
}
