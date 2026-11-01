'use client';

import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import type { NavSection } from '@/lib/navigation';

// Shared by the plain navbar links and the hover-menu trigger, so a section
// with sub-sections doesn't drift out of line with the ones without.
export const navItemClassName = (active: boolean) =>
  buttonVariants({
    color: 'ghost',
    size: 'sm',
    className: cn(
      '!text-sm !font-normal !h-8 transition-colors duration-200 ease-in-out',
      'lg:!px-3 !px-2',
      'text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white',
      active && 'text-black dark:text-white',
    ),
  });

export const NavItem = ({ section }: { section: NavSection }) => {
  const pathname = usePathname();
  const active = pathname.startsWith(section.url);

  return (
    <Link
      href={section.url}
      title={section.title}
      className={navItemClassName(active)}
    >
      <HugeiconsIcon
        icon={section.icon}
        strokeWidth={2}
        className={cn(
          'size-4 lg:hidden',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
      />
      <span className="lg:inline hidden">{section.title}</span>
    </Link>
  );
};
