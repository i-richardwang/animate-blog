import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

export const metadata: Metadata = {
  title: 'Token 用量',
  description: 'AI Token 使用量和成本的实时统计与趋势分析',
  openGraph: {
    title: 'Token 用量 - Richard Wang',
    description: 'AI Token 使用量和成本的实时统计与趋势分析',
    type: 'website',
  },
};

const TOKEN_USAGE_LAYOUT_PROPS: DocsLayoutProps = {
  tree: {
    name: 'Token Usage',
    children: [],
  },
  githubUrl: 'https://github.com/i-richardwang/animate-blog',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
};

export default function TokenUsageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout
        {...TOKEN_USAGE_LAYOUT_PROPS}
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
