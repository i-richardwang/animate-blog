import { cn } from '@/lib/utils';
import { Card } from 'fumadocs-ui/components/card';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { CodeBlock, Pre } from './components/docs/codeblock';
import { Callout } from './components/docs/callout';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    img: (props) => <ImageZoom {...(props as any)} />,
    Card: ({ children, className, accent, ...props }) => (
      <Card
        className={cn(
          'flex flex-col items-center justify-center py-7 bg-accent/50 border-none [&>h3]:text-base [&>h3]:text-current [&>div]:bg-transparent [&>div]:shadow-none [&>div]:border-none [&_svg]:size-10',
          accent && '[&>h3]:text-fd-muted-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    ),
    Steps,
    Step,
    Callout,
    pre: (props: ComponentProps<'pre'>) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
  };
}
