import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteLayoutProps } from '@/lib/site-layout';
import { projects } from '@/lib/source';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

const PROJECTS_LAYOUT_PROPS = siteLayoutProps(projects.pageTree);

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout {...PROJECTS_LAYOUT_PROPS}>{children}</DocsLayout>
    </>
  );
}
