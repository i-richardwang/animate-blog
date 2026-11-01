import { DocsTitle } from 'fumadocs-ui/page';
import type { ReactNode } from 'react';
import type { PageLink } from '@/lib/source';
import { PageNavigation } from './page-actions';

// A page's title, with its actions (children, e.g. CopyPage) and the arrows
// to its previous and next pages at the right.
export function PageTitle({
  title,
  previous,
  next,
  children,
}: {
  title: string;
  previous?: PageLink;
  next?: PageLink;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <DocsTitle className="font-medium">{title}</DocsTitle>
      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        {children}
        <PageNavigation previous={previous} next={next} />
      </div>
    </div>
  );
}
