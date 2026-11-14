import { DocsBody } from 'fumadocs-ui/page';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// DocsBody with the site's typography: medium-weight headings, and on an
// `article` (a blog post, a note, a project) larger text from the md
// breakpoint up.
export function SiteBody({
  article = false,
  className,
  ...props
}: ComponentProps<typeof DocsBody> & { article?: boolean }) {
  return (
    <DocsBody
      className={cn(
        'pb-10 pt-4 [&_:is(h1,h2,h3,h4,h5,h6)]:font-medium',
        article && 'md:text-lg',
        className,
      )}
      {...props}
    />
  );
}
