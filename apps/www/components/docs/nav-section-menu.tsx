'use client';

import Link from 'next/link';
import { cn } from '@workspace/ui/lib/utils';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@workspace/ui/components/ui/hover-card';
import { usePathname } from 'next/navigation';
import type { NavSection } from '@/lib/navigation';
import { navItemClassName } from './nav-item';

// A navbar section that has sub-sections: the trigger links to the section's
// own index page, hovering it lists the children.
export const NavSectionMenu = ({ section }: { section: NavSection }) => {
  const pathname = usePathname();
  const active = pathname.startsWith(section.url);
  const Icon = section.icon;

  return (
    <HoverCard openDelay={150} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href={section.url}
          title={section.title}
          className={navItemClassName(active)}
        >
          <Icon
            className={cn(
              'size-4 lg:hidden',
              active ? 'text-primary' : 'text-muted-foreground',
            )}
          />
          <span className="lg:inline hidden">{section.title}</span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent align="start" sideOffset={8} className="w-48 p-2">
        <div className="flex flex-col gap-0.5">
          {section.children?.map((child) => (
            <Link
              key={child.url}
              href={child.url}
              className="rounded-md px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-accent hover:text-black dark:hover:text-white transition-colors duration-200 ease-in-out"
            >
              {child.title}
            </Link>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
