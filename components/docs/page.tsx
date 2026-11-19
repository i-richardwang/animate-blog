import { DocsPage, type DocsPageProps } from 'fumadocs-ui/page';
import { cn } from '@/lib/utils';

// DocsPage with the site's defaults. The layout already pads the page for
// the fixed navbar (see components/site-layout.tsx), so the article swaps
// Fumadocs' tall, breakpoint-dependent top padding for the 24px gap Animate
// UI's docs keep under their navbar; the sidebar starts at the same line.
export function SitePage({ className, ...props }: DocsPageProps) {
  return (
    <DocsPage className={cn('pt-6 md:pt-6 xl:pt-6', className)} {...props} />
  );
}
