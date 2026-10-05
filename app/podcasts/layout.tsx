import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export default function PodcastsLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
