import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteLayoutProps } from '@/lib/site-layout';
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

const TOKEN_USAGE_LAYOUT_PROPS = siteLayoutProps({
  name: 'Token Usage',
  children: [],
});

export default function TokenUsageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout {...TOKEN_USAGE_LAYOUT_PROPS}>{children}</DocsLayout>
    </>
  );
}
