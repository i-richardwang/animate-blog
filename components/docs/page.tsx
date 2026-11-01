import { DocsPage, type DocsPageProps } from 'fumadocs-ui/page';
import { cn } from '@/lib/utils';

// DocsPage with the site's defaults. The layout already pads the page for
// the fixed navbar (see components/site-layout.tsx), so the article drops
// Fumadocs' own top padding.
export function SitePage({ className, ...props }: DocsPageProps) {
  return (
    <DocsPage className={cn('pt-0 md:pt-0 xl:pt-0', className)} {...props} />
  );
}
