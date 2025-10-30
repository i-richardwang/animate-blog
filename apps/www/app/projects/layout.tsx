import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import { projects } from '@/lib/source';
import { DocsSidebar } from '@/components/docs/sidebar';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

const PROJECTS_LAYOUT_PROPS: DocsLayoutProps = {
  tree: projects.pageTree,
  githubUrl: 'https://github.com/i-richardwang/animate-blog',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout
        {...PROJECTS_LAYOUT_PROPS}
        nav={{
          component: <Nav />,
        }}
        sidebar={{
          enabled: false,
        }}
      >
        {children}
      </DocsLayout>
      {/* Mobile-only sidebar overlay for Projects routes */}
      <DocsSidebar {...PROJECTS_LAYOUT_PROPS} />
    </>
  );
}
