import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import { reading } from '@/lib/source';
import { DocsSidebar } from '@/components/docs/sidebar';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

const READING_LAYOUT_PROPS: DocsLayoutProps = {
  tree: reading.pageTree,
  githubUrl: 'https://github.com/i-richardwang/animate-blog',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
};

export default function ReadingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout
        {...READING_LAYOUT_PROPS}
        nav={{
          component: <Nav />,
        }}
        sidebar={{
          enabled: false,
        }}
      >
        {children}
      </DocsLayout>
      {/* Mobile-only sidebar overlay for Reading routes */}
      <DocsSidebar {...READING_LAYOUT_PROPS} />
    </>
  );
}
