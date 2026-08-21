import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteLayoutProps } from '@/lib/site-layout';
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

const STATUS_LAYOUT_PROPS = siteLayoutProps({
  name: 'Status',
  children: [],
});

export default function StatusLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout {...STATUS_LAYOUT_PROPS}>{children}</DocsLayout>
    </>
  );
}
