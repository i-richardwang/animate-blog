import {
  ImageZoom,
  type ImageZoomProps,
} from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import {
  CodeBlock,
  Pre,
  type CodeBlockProps,
} from './components/docs/codeblock';
import { Callout } from './components/docs/callout';
import { Card, Cards } from './components/docs/cards';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    // fumadocs-mdx turns local images into static imports with their size,
    // which is the shape ImageZoom (a next/image) takes.
    img: (props) => <ImageZoom {...(props as ImageZoomProps)} />,
    Card,
    Cards,
    Steps,
    Step,
    Callout,
    pre: (props: ComponentProps<'pre'> & CodeBlockProps) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
  };
}
