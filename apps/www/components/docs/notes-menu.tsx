'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@workspace/ui/lib/utils';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@workspace/ui/components/ui/hover-card';

export const NOTES_ITEMS = [
  {
    title: 'AI Exploration',
    url: '/docs/ai',
  },
  {
    title: 'Data Science',
    url: '/docs/data-science',
  },
  {
    title: 'Development',
    url: '/docs/development',
  },
];

export const NotesMenu = () => {
  return (
    <HoverCard openDelay={150} closeDelay={200}>
      <HoverCardTrigger asChild>
        <button
          className={buttonVariants({
            color: 'ghost',
            size: 'sm',
            className: cn(
              '!text-sm !font-normal text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white !h-8 !px-3 transition-colors duration-200 ease-in-out group',
            ),
          })}
        >
          Notes
          <ChevronDown className="size-3 ml-1 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
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
