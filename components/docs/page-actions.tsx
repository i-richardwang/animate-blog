'use client';

// The buttons on a page: "Copy page" with a menu of other ways to read the
// page and the arrows to its neighbours in the title row (see page-title.tsx),
// and the links to a project's site and repository under its description.

import { DropdownMenu } from '@animate-ui/react/primitives/radix-ui';
import { Shine } from '@animate-ui/react/primitives/effects/shine';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  BubbleChatIcon,
  ChatGptIcon,
  ClaudeIcon,
  Copy01Icon,
  File02Icon,
  GithubIcon,
  LinkSquare02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import Link from 'next/link';
import { useCopied } from '@/hooks/use-copied';
import { SITE } from '@/lib/site';
import type { PageLink } from '@/lib/source';
import { cn } from '@/lib/utils';
import { IconSwap } from './icon-swap';

const button =
  'inline-flex h-8 items-center justify-center gap-1.5 bg-accent text-sm text-accent-foreground transition-colors hover:bg-accent/70';

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
  const { copied, copy } = useCopied();

  const copyPage = async () => {
    let markdown = cache.get(markdownUrl);
    if (markdown === undefined) {
      const response = await fetch(markdownUrl);
      markdown = await response.text();
      cache.set(markdownUrl, markdown);
    }
    await copy(markdown);
  };

  const prompt = new URLSearchParams({
    q: `Read ${SITE.url}${markdownUrl}, I want to ask questions about it.`,
  });
  const items: { title: string; href: string; icon: IconSvgElement }[] = [
    {
      title: 'View as Markdown',
      href: markdownUrl,
      icon: File02Icon,
    },
    {
      title: 'Open in ChatGPT',
      href: `https://chatgpt.com/?hints=search&${prompt}`,
      icon: ChatGptIcon,
    },
    {
      title: 'Open in Claude',
      href: `https://claude.ai/new?${prompt}`,
      icon: ClaudeIcon,
    },
    {
      title: 'Open in T3 Chat',
      href: `https://t3.chat/new?${prompt}`,
      icon: BubbleChatIcon,
    },
    {
      title: 'Edit on GitHub',
      href: githubUrl,
      icon: GithubIcon,
    },
  ];

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={copyPage}
        className={cn(button, 'rounded-l-md pr-3 pl-2.5')}
      >
        <IconSwap
          active={copied}
          icon={Copy01Icon}
          activeIcon={Tick02Icon}
          size={14}
        />
        Copy page
      </button>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger
          aria-label="More page actions"
          className={cn(button, 'w-8 rounded-r-md border-l border-background')}
        >
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} size={14} />
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
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} size={14} />
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
    icon: IconSvgElement,
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
        <HugeiconsIcon icon={icon} strokeWidth={2} size={14} />
      </Link>
    ) : (
      <span className={cn(button, 'w-8 rounded-md opacity-40')} aria-hidden>
        <HugeiconsIcon icon={icon} strokeWidth={2} size={14} />
      </span>
    );

  return (
    <div className="flex items-center gap-2">
      {arrow(previous, '上一篇', ArrowLeft02Icon, 'nav-back')}
      {arrow(next, '下一篇', ArrowRight02Icon, 'nav-forward')}
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
            <HugeiconsIcon icon={LinkSquare02Icon} strokeWidth={2} />
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
            <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
            View Code on GitHub
          </a>
        </Shine>
      )}
    </>
  );
}
