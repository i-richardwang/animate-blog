'use client';

import {
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ScrollArea,
  ScrollBar,
  ScrollViewport,
} from '@/components/ui/scroll-area';

export function Pre({ className, ...props }: HTMLAttributes<HTMLPreElement>) {
  return (
    <pre className={cn('p-4 focus-visible:outline-none', className)} {...props}>
      {props.children}
    </pre>
  );
}

// `title` and `icon` arrive on <pre> from Fumadocs' rehype-code.
export function CodeBlock({
  title,
  icon,
  ...props
}: HTMLAttributes<HTMLElement> & { icon?: ReactNode }) {
  const [isCopied, setIsCopied] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  const onCopy = useCallback(() => {
    const pre = areaRef.current?.getElementsByTagName('pre').item(0);

    if (!pre) return;

    const clone = pre.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.nd-copy-ignore').forEach((node) => {
      node.remove();
    });

    void navigator.clipboard.writeText(clone.textContent ?? '').then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  }, []);

  return (
    <figure
      {...props}
      className={cn(
        'not-prose group fd-codeblock relative my-6 overflow-hidden rounded-xl text-sm [&.shiki]:!bg-accent',
        props.className,
      )}
    >
      {title ? (
        <div className="flex flex-row items-center gap-2 pl-4 pr-4 h-10">
          {icon ? (
            <div
              className="text-muted-foreground [&_svg]:size-3.5"
              dangerouslySetInnerHTML={
                typeof icon === 'string' ? { __html: icon } : undefined
              }
            >
              {typeof icon !== 'string' ? icon : null}
            </div>
          ) : null}
          <figcaption className="flex-1 truncate text-muted-foreground">
            {title}
          </figcaption>
          <CopyButton
            className="-me-2"
            onClick={onCopy}
            isCopied={isCopied}
          />
        </div>
      ) : (
        <div className="absolute right-0 top-0 z-[2] bg-accent p-1.5 rounded-bl-xl">
          <CopyButton onClick={onCopy} isCopied={isCopied} />
        </div>
      )}
      <div className={cn('p-1.5', title && 'pt-0')}>
        <ScrollArea ref={areaRef} dir="ltr">
          <ScrollViewport
            data-slot="codeblock-viewport"
            className="max-h-[600px] bg-background rounded-md [&_code]:!text-[13px] [&_code_.line]:!px-0"
          >
            {props.children}
          </ScrollViewport>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </figure>
  );
}

function CopyButton({
  className,
  isCopied,
  onClick,
}: {
  className?: string;
  isCopied: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center justify-center rounded-md transition-[box-shadow,_color,_background-color,_border-color,_outline-color,_text-decoration-color,_fill,_stroke] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        "size-7 [&_svg:not([class*='size-'])]:size-3.5 rounded-md",
        'bg-transparent hover:bg-black/5 dark:hover:bg-white/10',
        className,
      )}
      onClick={isCopied ? undefined : onClick}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={isCopied ? 'check' : 'copy'}
          initial={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
          transition={{ duration: 0.25 }}
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
