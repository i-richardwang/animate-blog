import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

export const metadata: Metadata = {
  title: '系统状态',
  description: '所有服务的实时状态和运行时间信息',
  openGraph: {
    title: '系统状态 - Richard Wang',
    description: '所有服务的实时状态和运行时间信息',
    type: 'website',
  },
};

const STATUS_LAYOUT_PROPS: DocsLayoutProps = {
  tree: {
    name: 'Status',
    children: [],
  },
  githubUrl: 'https://github.com/i-richardwang/animate-blog',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
};

export default function StatusLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout
        {...STATUS_LAYOUT_PROPS}
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
