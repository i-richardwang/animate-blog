import { DocsBody } from 'fumadocs-ui/page';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// DocsBody with the site's typography: semibold section headings (as on
// Animate UI's docs; the page title stays medium), and on an
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
        'pb-10 pt-4 [&_h1]:font-medium [&_:is(h2,h3,h4,h5,h6)]:font-semibold',
        article && 'md:text-lg',
        className,
      )}
      {...props}
    />
  );
}
