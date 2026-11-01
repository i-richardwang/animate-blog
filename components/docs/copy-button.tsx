'use client';

// A code block's copy button: the clipboard icon turns into a tick for a
// moment after the click.

import { Button } from '@animate-ui/react/primitives/buttons/button';
import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { IconSwap } from './icon-swap';

export function CopyButton({
  getText,
  className,
  delay = 2000,
}: {
  getText: () => string | undefined;
  className?: string;
  delay?: number;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <Button
      type="button"
      data-slot="copy-button"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={() => {
        const text = getText();
        if (text === undefined) return;
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setCopied(false), delay);
        });
      }}
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 dark:hover:bg-white/10',
        className,
      )}
    >
      <IconSwap active={copied} icon={Copy} activeIcon={Check} size={14} />
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
