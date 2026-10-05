import type { LoaderPlugin } from 'fumadocs-core/source';
import { cn } from '@workspace/ui/lib/utils';
import { Dancing_Script } from 'next/font/google';

const dancing = Dancing_Script({ subsets: ['latin'] });

const Badge = ({
  name,
  children,
}: {
  name: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <span className="flex items-center gap-3 w-full justify-between">
      <span className="!font-normal">{name}</span>{' '}
      <span className="text-[17px] text-nowrap text-foreground leading-1 font-black">
        <span className={cn(dancing.className, 'leading-1')}>{children}</span>
      </span>
    </span>
  );
};

// Marks notes released in the last 30 days with a "new" badge.
export const attachFile: LoaderPlugin = {
  name: 'attach-file',
  transformPageTree: {
    file(node, filePath) {
      if (!filePath) return node;
      const file = this.storage.read(filePath);
      if (!file || file.format !== 'page') return node;
      return decorate(node, file.data as Record<string, unknown>);
    },
  },
};

const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function decorate<N extends { name: React.ReactNode }>(
  node: N,
  data: Record<string, unknown>,
): N {
  const { releaseDate } = data;
  if (
    releaseDate instanceof Date &&
    Date.now() - releaseDate.getTime() <= NEW_WINDOW_MS
  ) {
    node.name = <Badge name={node.name}>new</Badge>;
  }
  return node;
}
