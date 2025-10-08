import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import XIcon from '@workspace/ui/components/icons/x-icon';
import { getSortedBlogPosts } from '@/lib/source';
import type { PageTree } from 'fumadocs-core/server';

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
  githubUrl: 'https://github.com/imskyleen/animate-ui',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
  links: [
    ...(baseOptions.links || []),
    {
      icon: <XIcon />,
      url: 'https://x.com/animate_ui',
      text: 'X',
      type: 'icon',
    },
  ],
  sidebar: {
    enabled: false,
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...BLOG_LAYOUT_PROPS}
      nav={{
        component: <Nav />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
