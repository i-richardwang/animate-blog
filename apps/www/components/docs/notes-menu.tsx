'use client';

import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@workspace/ui/lib/utils';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@workspace/ui/components/ui/hover-card';
import { BookText } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const NOTES_ITEMS = [
  {
    title: 'AI 探索',
    url: '/docs/ai',
  },
  {
    title: '数据科学',
    url: '/docs/data-science',
  },
  {
    title: '开发实践',
    url: '/docs/development',
  },
];

export const NotesMenu = () => {
  const pathname = usePathname();
  const active = pathname.startsWith('/docs');

  return (
    <HoverCard openDelay={150} closeDelay={200}>
      <HoverCardTrigger asChild>
        <button
          className={buttonVariants({
            color: 'ghost',
            size: 'sm',
            className: cn(
              '!text-sm !font-normal !h-8 transition-colors duration-200 ease-in-out',
              'lg:!px-3 !px-2',
              active
                ? 'text-primary hover:text-primary !font-medium'
                : 'text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white',
            ),
          })}
        >
          <BookText className={cn('size-4 lg:hidden', active ? 'text-primary' : 'text-muted-foreground')} />
          <span className="lg:inline hidden">笔记</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="start" sideOffset={8} className="w-48 p-2">
        <div className="flex flex-col gap-0.5">
          {NOTES_ITEMS.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="rounded-md px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-accent hover:text-black dark:hover:text-white transition-colors duration-200 ease-in-out"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
