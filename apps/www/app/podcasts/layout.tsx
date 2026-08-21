import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import { podcasts } from '@/lib/source';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

const PODCASTS_LAYOUT_PROPS: DocsLayoutProps = {
  tree: podcasts.pageTree,
  githubUrl: 'https://github.com/i-richardwang/animate-blog',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
};

export default function PodcastsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout
        {...PODCASTS_LAYOUT_PROPS}
        nav={{
          component: <Nav />,
        }}
        sidebar={{
          enabled: false,
        }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
