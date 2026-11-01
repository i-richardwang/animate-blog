'use client';

// The buttons in a page's title row (see page-title.tsx): "Copy page" with a
// menu of other ways to read the page, and the arrows to its neighbours.

import { DropdownMenu } from '@animate-ui/react/primitives/radix-ui';
import { Shine } from '@animate-ui/react/primitives/effects/shine';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLinkIcon,
  FileText,
  Github,
  MessageCircleIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { SITE } from '@/lib/site';
import type { PageLink } from '@/lib/source';
import { cn } from '@/lib/utils';
import { IconSwap } from './icon-swap';

const button =
  'inline-flex h-8 items-center justify-center gap-1.5 bg-accent text-sm text-accent-foreground transition-colors hover:bg-accent/70';

function OpenAILogo(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function AnthropicLogo(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

const cache = new Map<string, string>();

export function CopyPage({
  markdownUrl,
  githubUrl,
}: {
  /** The page's raw Markdown, e.g. `/docs/<path>.mdx`. */
  markdownUrl: string;
  /** The page's source on GitHub. */
  githubUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    let markdown = cache.get(markdownUrl);
    if (markdown === undefined) {
      const response = await fetch(markdownUrl);
      markdown = await response.text();
      cache.set(markdownUrl, markdown);
    }
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const prompt = new URLSearchParams({
    q: `Read ${SITE.url}${markdownUrl}, I want to ask questions about it.`,
  });
  const icon = 'size-3.5';
  const items: { title: string; href: string; icon: ReactNode }[] = [
    {
      title: 'View as Markdown',
      href: markdownUrl,
      icon: <FileText className={icon} />,
    },
    {
      title: 'Open in ChatGPT',
      href: `https://chatgpt.com/?hints=search&${prompt}`,
      icon: <OpenAILogo className={icon} />,
    },
    {
      title: 'Open in Claude',
      href: `https://claude.ai/new?${prompt}`,
      icon: <AnthropicLogo className={icon} />,
    },
    {
      title: 'Open in T3 Chat',
      href: `https://t3.chat/new?${prompt}`,
      icon: <MessageCircleIcon className={icon} />,
    },
    {
      title: 'Edit on GitHub',
      href: githubUrl,
      icon: <Github className={icon} />,
    },
  ];

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={copy}
        className={cn(button, 'rounded-l-md pr-3 pl-2.5')}
      >
        <IconSwap active={copied} icon={Copy} activeIcon={Check} size={14} />
        Copy page
      </button>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          aria-label="More page actions"
          className={cn(button, 'w-8 rounded-r-md border-l border-background')}
        >
          <ChevronDown className="size-3.5" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 flex w-48 origin-(--radix-dropdown-menu-content-transform-origin) flex-col rounded-xl border bg-popover p-1 text-sm text-popover-foreground shadow-md"
          >
            {items.map((item) => (
              <DropdownMenu.Item key={item.title} asChild>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 rounded-[9px] px-2 py-1.5 text-muted-foreground outline-none transition-colors data-highlighted:bg-accent data-highlighted:text-foreground"
                >
                  {item.icon}
                  {item.title}
                </a>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

// Arrows to the previous and next pages. The page transition plays forward
// by default; the previous arrow plays it back.
export function PageNavigation({
  previous,
  next,
}: {
  previous?: PageLink;
  next?: PageLink;
}) {
  const arrow = (
    target: PageLink | undefined,
    label: string,
    Icon: typeof ArrowLeft,
    direction: 'nav-back' | 'nav-forward',
  ) =>
    target ? (
      <Link
        href={target.url}
        transitionTypes={[direction]}
        aria-label={`${label}: ${target.name}`}
        title={target.name}
        className={cn(button, 'w-8 rounded-md')}
      >
        <Icon className="size-3.5" />
      </Link>
    ) : (
      <span className={cn(button, 'w-8 rounded-md opacity-40')} aria-hidden>
        <Icon className="size-3.5" />
      </span>
    );

  return (
    <div className="flex items-center gap-2">
      {arrow(previous, '上一篇', ArrowLeft, 'nav-back')}
      {arrow(next, '下一篇', ArrowRight, 'nav-forward')}
    </div>
  );
}

export function ProjectActions({
  projectUrl,
  githubUrl,
}: {
  /** Live project URL */
  projectUrl?: string;
  /** GitHub repository URL */
  githubUrl?: string;
}) {
  if (!projectUrl && !githubUrl) {
    return null;
  }

  const className = cn(
    buttonVariants({
      color: 'ghost',
      size: 'sm',
      className:
        'gap-2 [&_svg]:size-3.5 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:text-primary-foreground border-0',
    }),
  );

  return (
    <>
      {projectUrl && (
        <Shine enableOnHover duration={1200} asChild>
          <a
            href={projectUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={className}
          >
            <ExternalLinkIcon />
            Visit Website
          </a>
        </Shine>
      )}

      {githubUrl && (
        <Shine enableOnHover duration={1200} asChild>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={className}
          >
            <Github />
            View Code on GitHub
          </a>
        </Shine>
      )}
    </>
  );
}
