import { cn } from '@/lib/utils';
import { Card } from 'fumadocs-ui/components/card';
import {
  ImageZoom,
  type ImageZoomProps,
} from 'fumadocs-ui/components/image-zoom';
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
    // fumadocs-mdx turns local images into static imports with their size,
    // which is the shape ImageZoom (a next/image) takes.
    img: (props) => <ImageZoom {...(props as ImageZoomProps)} />,
    Card: ({ className, ...props }: ComponentProps<typeof Card>) => (
      <Card
        className={cn(
          'flex flex-col items-center justify-center py-7 bg-accent/50 border-none [&>h3]:text-base [&>h3]:text-current [&>div]:bg-transparent [&>div]:shadow-none [&>div]:border-none [&_svg]:size-10',
          className,
        )}
        {...props}
      />
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
