'use client';

import { CodeBlock, Pre } from '@/components/docs/codeblock';
import type { HighlightOptions } from 'fumadocs-core/highlight';
import { useShiki } from 'fumadocs-core/highlight/client';
import { cn } from '@workspace/ui/lib/utils';
import type { ComponentProps } from 'react';

const getComponents = ({
  title,
  icon,
  onCopied,
  className,
}: {
  title?: string;
  icon?: React.ReactNode;
  onCopied?: () => void;
  className?: string;
}) =>
  ({
    pre(props: ComponentProps<'pre'>) {
      return (
        <CodeBlock
          {...props}
          title={title}
          icon={icon}
          onCopied={onCopied}
          className={cn('my-0', props.className, className)}
        >
          <Pre>{props.children}</Pre>
        </CodeBlock>
      );
    },
  }) satisfies HighlightOptions['components'];

export type DynamicCodeBlockProps = {
  lang: string;
  code: string;
  title?: string;
  icon?: React.ReactNode;
  onCopied?: () => void;
  options?: Omit<HighlightOptions, 'lang'>;
  className?: string;
};

export function DynamicCodeBlock({
  lang,
  code,
  options,
  title,
  icon,
  onCopied,
  className,
}: DynamicCodeBlockProps) {
  const components = getComponents({ title, icon, onCopied, className });

  return useShiki(code, {
    lang,
    ...options,
    components: {
      ...components,
      ...options?.components,
    },
  });
}
