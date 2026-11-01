import type { LoaderPlugin } from 'fumadocs-core/source';
import { Dancing_Script } from 'next/font/google';
import { cn } from '@/lib/utils';

const dancing = Dancing_Script({ subsets: ['latin'] });

export type PageBadge = 'new' | 'updated';

const BADGE_COLORS: Record<PageBadge, string> = {
  new: '',
  updated: 'text-muted-foreground',
};

export function BadgeLabel({
  badge,
  className,
}: {
  badge: PageBadge;
  className?: string;
}) {
  return (
    <span
      data-slot="badge"
      className={cn(
        dancing.className,
        'text-[15px] leading-1 font-black text-nowrap text-foreground',
        BADGE_COLORS[badge],
        className,
      )}
    >
      {badge}
    </span>
  );
}

const RECENT_MS = 30 * 24 * 60 * 60 * 1000;

const isRecent = (date: unknown) =>
  date instanceof Date && Date.now() - date.getTime() <= RECENT_MS;

// A note released in the last 30 days is "new"; one updated in the last 30
// days (`updatedDate` in the frontmatter) is "updated".
export function pageBadge(data: Record<string, unknown>): PageBadge | null {
  if (isRecent(data.releaseDate)) return 'new';
  if (isRecent(data.updatedDate)) return 'updated';
  return null;
}

// Puts the badge after the note's name in the sidebar.
export const attachFile: LoaderPlugin = {
  name: 'attach-file',
  transformPageTree: {
    file(node, filePath) {
      if (!filePath) return node;
      const file = this.storage.read(filePath);
      if (!file || file.format !== 'page') return node;
      const badge = pageBadge(file.data as Record<string, unknown>);
      if (!badge) return node;
      node.name = (
        <span className="flex w-full items-center justify-between gap-3">
          <span>{node.name}</span>
          <BadgeLabel badge={badge} />
        </span>
      );
      return node;
    },
  },
};
