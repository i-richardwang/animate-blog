import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
