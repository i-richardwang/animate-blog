'use client';

import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import type { NavSection } from '@/lib/navigation';

// Shared by the plain navbar links and the hover-menu trigger, so a section
// with sub-sections doesn't drift out of line with the ones without.
export const navItemClassName = (active: boolean) =>
  cn(
    buttonVariants({ color: 'ghost', size: 'sm' }),
    'h-8 px-3 text-sm font-normal transition-colors duration-200 ease-in-out',
    'text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white',
    active && 'text-black dark:text-white',
  );

export const NavItem = ({ section }: { section: NavSection }) => {
  const pathname = usePathname();
  const active = pathname.startsWith(section.url);

  return (
    <Link href={section.url} className={navItemClassName(active)}>
      {section.title}
    </Link>
  );
};
