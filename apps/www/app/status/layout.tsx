import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export const metadata: Metadata = {
  title: '系统状态',
  description: '所有服务的实时状态和运行时间信息',
  openGraph: {
    title: '系统状态 - Richard Wang',
    description: '所有服务的实时状态和运行时间信息',
    type: 'website',
  },
};

export default function StatusLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
