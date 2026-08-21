import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteLayoutProps } from '@/lib/site-layout';
import { reading } from '@/lib/source';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

const READING_LAYOUT_PROPS = siteLayoutProps(reading.pageTree);

export default function ReadingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout {...READING_LAYOUT_PROPS}>{children}</DocsLayout>
    </>
  );
}
