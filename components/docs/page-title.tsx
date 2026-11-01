import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DocsTitle } from 'fumadocs-ui/page';
import { Button } from '@/components/animate-ui/components/buttons/button';
import type { PageLink } from '@/lib/source';

// A page's title with buttons to its previous and next pages. `emptyLabels`
// name the missing neighbour for screen readers, e.g. "没有更早的文章".
// The page transition plays forward by default; the previous button plays it
// back.
export function PageTitle({
  title,
  url,
  previous,
  next,
  emptyLabels,
}: {
  title: string;
  url: string;
  previous?: PageLink;
  next?: PageLink;
  emptyLabels: { previous: string; next: string };
}) {
  return (
    <div className="flex flex-row gap-2 items-start w-full justify-between">
      <DocsTitle className="font-medium">{title}</DocsTitle>
      {(previous || next) && (
        <div className="flex flex-row gap-1.5 items-center pt-0.5">
          <NavButton
            link={previous}
            url={url}
            emptyLabel={emptyLabels.previous}
            back
          >
            <ArrowLeft />
          </NavButton>
          <NavButton link={next} url={url} emptyLabel={emptyLabels.next}>
            <ArrowRight />
          </NavButton>
        </div>
      )}
    </div>
  );
}

function NavButton({
  link,
  url,
  emptyLabel,
  back,
  children,
}: {
  link?: PageLink;
  url: string;
  emptyLabel: string;
  back?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button variant="accent" size="icon-sm" asChild>
      <Link
        href={link?.url ?? url}
        transitionTypes={back ? ['nav-back'] : undefined}
        aria-disabled={!link}
        className={!link ? 'pointer-events-none opacity-50' : undefined}
        aria-label={link ? `前往 ${link.name}` : emptyLabel}
      >
        {children}
      </Link>
    </Button>
  );
}
