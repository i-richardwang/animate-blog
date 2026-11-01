'use client';

// A code block's copy button: the clipboard icon turns into a tick for a
// moment after the click.

import { Button } from '@animate-ui/react/primitives/buttons/button';
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { useCopied } from '@/hooks/use-copied';
import { cn } from '@/lib/utils';
import { IconSwap } from './icon-swap';

export function CopyButton({
  getText,
  className,
}: {
  getText: () => string | undefined;
  className?: string;
}) {
  const { copied, copy } = useCopied();

  return (
    <Button
      type="button"
      data-slot="copy-button"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={() => {
        const text = getText();
        if (text !== undefined) void copy(text);
      }}
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 dark:hover:bg-white/10',
        className,
      )}
    >
      <IconSwap
        active={copied}
        icon={Copy01Icon}
        activeIcon={Tick02Icon}
        size={14}
      />
    </Button>
  );
}

// The code inside `container`'s <pre>, without the parts marked as not to be
// copied (line numbers, diff markers).
export function getPreText(container: HTMLElement | null | undefined) {
  const pre = container?.getElementsByTagName('pre').item(0);
  if (!pre) return undefined;
  const clone = pre.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
    node.replaceWith('\n');
  });
  return clone.textContent ?? '';
}
