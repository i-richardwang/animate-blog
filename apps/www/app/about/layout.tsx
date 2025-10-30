import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

export const metadata: Metadata = {
  title: 'About Me',
  description:
    'Learning, Building, Sharing. 科幻爱好者、摄影器材党、Self-Hosted 实践者、音乐发烧友、电影爱好者。',
  openGraph: {
    title: 'About Me - Richard Wang',
    description:
      'Learning, Building, Sharing. 科幻爱好者、摄影器材党、Self-Hosted 实践者、音乐发烧友、电影爱好者。',
    type: 'profile',
  },
};

const ABOUT_LAYOUT_PROPS: DocsLayoutProps = {
  tree: {
    name: 'About',
    children: [],
  },
  githubUrl: 'https://github.com/i-richardwang/animate-blog',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout
        {...ABOUT_LAYOUT_PROPS}
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

