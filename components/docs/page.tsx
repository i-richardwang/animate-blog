import { DocsPage, type DocsPageProps } from 'fumadocs-ui/page';
import {
  TOCPopover,
  TOCProvider,
} from 'fumadocs-ui/layouts/docs/page/slots/toc';
import { TOC } from '@/components/docs/toc';
import { cn } from '@/lib/utils';

// Every page's TOC keeps Fumadocs' provider and popover; only the desktop
// list is the site's own.
const tocSlots = { provider: TOCProvider, main: TOC, popover: TOCPopover };

type PageProps = Omit<
  DocsPageProps,
  'toc' | 'tableOfContent' | 'tableOfContentPopover'
>;

// DocsPage with the site's defaults. The layout already pads the page for
// the fixed navbar (see components/site-layout.tsx), so the page keeps the
// 24px gap Animate UI's docs keep under their navbar at every width, where
// Fumadocs steps its top padding up from the md breakpoint. The sidebar
// starts at the same line.
function SitePage({ className, slots, ...props }: DocsPageProps) {
  return (
    <DocsPage
      className={cn('md:pt-6 xl:pt-6', className)}
      slots={{ toc: tocSlots, ...slots }}
      {...props}
    />
  );
}

// A section's own page, such as a list of posts or a dashboard: the full
// content width, without a TOC.
export function SectionPage({ className, ...props }: PageProps) {
  return (
    <SitePage
      tableOfContent={{ enabled: false }}
      className={cn('max-w-[1124px]', className)}
      {...props}
    />
  );
}

// A single note, post, project or episode: a reading-width column, with the
// TOC beside it from the xl breakpoint and none below.
export function ArticlePage({
  className,
  ...props
}: PageProps & { toc: NonNullable<DocsPageProps['toc']> }) {
  return (
    <SitePage
      tableOfContentPopover={{ enabled: false }}
      className={cn('max-w-[860px]', className)}
      {...props}
    />
  );
}
