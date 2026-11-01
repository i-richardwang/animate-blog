'use client';

// Code blocks in MDX content: an accent frame with the code on its own
// background inside, scrolling natively, the copy button floating at the
// top right (or in the title bar when the block has one). `title`, `icon`
// and the line-number flags arrive on <pre> from Fumadocs' rehype-code.

import {
  useRef,
  type ComponentProps,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { CopyButton, getPreText } from './copy-button';

export type CodeBlockProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title?: ReactNode;
  icon?: ReactNode;
  allowCopy?: boolean | 'true' | 'false';
  viewportClassName?: string;
  'data-line-numbers'?: boolean;
  'data-line-numbers-start'?: number;
};

export function Pre({ className, ...props }: ComponentProps<'pre'>) {
  return (
    <pre
      {...props}
      className={cn(
        'w-max min-w-full focus-visible:outline-none *:flex *:flex-col',
        className,
      )}
    />
  );
}

export function CodeBlock({
  title,
  icon,
  allowCopy = true,
  viewportClassName,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const copy = allowCopy !== false && allowCopy !== 'false';

  return (
    <figure
      {...props}
      dir="ltr"
      tabIndex={-1}
      data-slot="codeblock"
      className={cn(
        'shiki group not-prose relative my-6 overflow-hidden rounded-xl bg-accent text-sm',
        className,
      )}
    >
      {title ? (
        <div className="flex h-10 items-center gap-2 pr-2.5 pl-4 text-muted-foreground">
          {typeof icon === 'string' ? (
            <div
              className="[&_svg]:size-3.5"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          ) : (
            icon && <div className="[&_svg]:size-3.5">{icon}</div>
          )}
          <figcaption className="flex-1 truncate">{title}</figcaption>
          {copy && <CopyButton getText={() => getPreText(areaRef.current)} />}
        </div>
      ) : (
        copy && (
          <div className="absolute top-3 right-3 z-2">
            <CopyButton getText={() => getPreText(areaRef.current)} />
          </div>
        )
      )}
      <div className={cn('p-1', title && 'pt-0')}>
        <div className="overflow-hidden rounded-lg bg-background">
          <div
            ref={areaRef}
            role="region"
            tabIndex={0}
            data-slot="codeblock-viewport"
            className={cn(
              'fd-scroll-container max-h-[600px] overflow-auto overscroll-x-none py-3.5 text-[13px] leading-relaxed focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset',
              viewportClassName,
            )}
            style={
              {
                // Room for the floating copy button on the first line.
                ...(!title && copy
                  ? { '--padding-right': 'calc(var(--spacing) * 10)' }
                  : {}),
                counterSet: props['data-line-numbers']
                  ? `line ${Number(props['data-line-numbers-start'] ?? 1) - 1}`
                  : undefined,
              } as CSSProperties
            }
          >
            {children}
          </div>
        </div>
      </div>
    </figure>
  );
}
