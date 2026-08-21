import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteLayoutProps } from '@/lib/site-layout';
import { podcasts } from '@/lib/source';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

const PODCASTS_LAYOUT_PROPS = siteLayoutProps(podcasts.pageTree);

export default function PodcastsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout {...PODCASTS_LAYOUT_PROPS}>{children}</DocsLayout>
    </>
  );
}
