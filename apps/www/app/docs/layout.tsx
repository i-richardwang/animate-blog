import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteLayoutProps } from '@/lib/site-layout';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { Footer } from '@/components/footer';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

const DOCS_LAYOUT_PROPS = siteLayoutProps(source.pageTree);

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout {...DOCS_LAYOUT_PROPS}>{children}</DocsLayout>
      <Footer />
    </>
  );
}
