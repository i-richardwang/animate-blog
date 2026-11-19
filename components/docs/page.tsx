import { DocsPage, type DocsPageProps } from 'fumadocs-ui/page';
import {
  TOCPopover,
  TOCProvider,
} from 'fumadocs-ui/layouts/docs/page/slots/toc';
import { TOC } from '@/components/docs/toc';
import { cn } from '@/lib/utils';

// Every page's TOC keeps Fumadocs' provider and popover; only the desktop
// list is the site's own, the same on notes, blog posts and projects.
const tocSlots = { provider: TOCProvider, main: TOC, popover: TOCPopover };

// DocsPage with the site's defaults. The layout already pads the page for
// the fixed navbar (see components/site-layout.tsx), so the article swaps
// Fumadocs' tall, breakpoint-dependent top padding for the 24px gap Animate
// UI's docs keep under their navbar; the sidebar starts at the same line.
export function SitePage({ className, slots, ...props }: DocsPageProps) {
  return (
    <DocsPage
      className={cn('pt-6 md:pt-6 xl:pt-6', className)}
      slots={{ toc: tocSlots, ...slots }}
      {...props}
    />
  );
}
