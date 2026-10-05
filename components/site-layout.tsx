import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from 'fumadocs-ui/layouts/docs/slots/sidebar';
import type * as PageTree from 'fumadocs-core/page-tree';
import { baseOptions } from '@/app/layout.config';
import { Nav } from '@/components/docs/nav';
import { DocsSidebar } from '@/components/docs/sidebar';
import { Footer } from '@/components/footer';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';
import { SITE } from '@/lib/site';

// Every section of the site renders inside Fumadocs' DocsLayout so they share
// one navbar, one mobile drawer and one page grid.
//
// The site navbar is a fixed, full-width bar rather than the layout's own
// header. It is plugged in through the `header` slot and its height is
// published as `--fd-banner-height` (see globals.css), which the layout uses
// to keep the sidebar and TOC below a fixed bar; the container gets the same
// amount of top padding so content starts below it.
// A section gets a desktop sidebar only when it passes a page tree (the notes
// do; the blog and the other flat sections don't). Without one, the mobile
// drawer is just the site menu.
const EMPTY_TREE: PageTree.Root = { name: 'Site', children: [] };

export function SiteLayout({
  tree = EMPTY_TREE,
  children,
}: {
  tree?: PageTree.Root;
  children: ReactNode;
}) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout
        {...baseOptions}
        tree={tree}
        githubUrl={SITE.repo}
        slots={{
          header: Nav,
          sidebar: {
            provider: SidebarProvider,
            root: DocsSidebar,
            trigger: SidebarTrigger,
            useSidebar,
          },
        }}
        containerProps={{ className: 'pt-(--fd-banner-height)' }}
      >
        {children}
      </DocsLayout>
      <Footer />
    </>
  );
}
