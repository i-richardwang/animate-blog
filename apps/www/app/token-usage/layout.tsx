import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export const metadata: Metadata = {
  title: 'Token 用量',
  description: 'AI Token 使用量和成本的实时统计与趋势分析',
  openGraph: {
    title: 'Token 用量 - Richard Wang',
    description: 'AI Token 使用量和成本的实时统计与趋势分析',
    type: 'website',
  },
};

export default function TokenUsageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SiteLayout>{children}</SiteLayout>;
}
