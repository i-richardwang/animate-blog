import { DocsBody } from 'fumadocs-ui/page';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// DocsBody with the site's spacing and, on an `article` (a blog post, a
// note, a project), larger text from the md breakpoint up. Heading weights
// are set for all prose in globals.css.
export function SiteBody({
  article = false,
  className,
  ...props
}: ComponentProps<typeof DocsBody> & { article?: boolean }) {
  return (
    <DocsBody
      className={cn('pb-10 pt-4', article && 'md:text-lg', className)}
      {...props}
    />
  );
}
