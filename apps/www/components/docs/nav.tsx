'use client';

import Link from 'next/link';
import React from 'react';
import { IconLogo } from '../icon-logo';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@workspace/ui/lib/utils';
import { CommandIcon } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { ThemeSwitcher } from '../animate/theme-switcher';
import XIcon from '@workspace/ui/components/icons/x-icon';
import GithubIcon from '@workspace/ui/components/icons/github-icon';
import MailIcon from '@workspace/ui/components/icons/mail-icon';
import { Menu } from '@/registry/icons/menu';
import { visibleSections } from '@/lib/navigation';
import { NavItem } from './nav-item';
import { NavSectionMenu } from './nav-section-menu';

export const Nav = () => {
  const { setOpenSearch } = useSearchContext();
  const { open, setOpen } = useSidebar();

  return (
    // Fumadocs 16 dropped the `Navbar` wrapper; this is its v15 markup inline.
    <header
      id="nd-subnav"
      className="fixed top-(--fd-banner-height) inset-x-0 z-30 flex items-center px-4 border-b transition-colors backdrop-blur-sm md:h-17 h-14 border-b-0 bg-background"
    >
      <div className="flex items-center gap-3 max-w-[1670px] w-full mx-auto md:px-5 px-3">
        <Link
          href="/"
          className={buttonVariants({
            color: 'ghost',
            size: 'icon-sm',
            className:
              '[&_svg]:!size-5 md:[&_svg]:!size-4.5 !p-0 !size-8 transition-colors duration-200 ease-in-out',
          })}
        >
          <IconLogo size="sm" />
        </Link>

        <div className="flex items-center md:justify-between justify-end gap-2 flex-1">
          <div className="md:flex hidden items-center gap-1">
            {visibleSections.map((section) =>
              section.children ? (
                <NavSectionMenu key={section.url} section={section} />
              ) : (
                <NavItem key={section.url} section={section} />
              ),
            )}
          </div>

          <div className="flex items-center md:gap-3 gap-2">
            <button
              className="pl-3 pr-1.5 h-8 w-48 lg:w-56 xl:w-64 bg-accent hover:bg-accent/70 transition-colors duration-200 ease-in-out text-sm text-muted-foreground rounded-md flex items-center justify-between"
              onClick={() => setOpenSearch(true)}
            >
              <span className="font-normal">Search...</span>

              <div className="flex items-center gap-1">
                <kbd className="size-5 leading-none flex items-center justify-center border rounded-[4px] bg-background">
                  <CommandIcon className="size-2.5" />
                </kbd>
                <kbd className="size-5 flex items-center justify-center border rounded-[4px] bg-background">
                  <span className="leading-none text-[0.625rem] pt-px">K</span>
                </kbd>
              </div>
            </button>

            <div className="flex items-center gap-1 max-md:hidden">
              <a
                href="https://github.com/i-richardwang/animate-blog"
                rel="noreferrer noopener"
                target="_blank"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 hover:bg-fd-accent hover:text-fd-accent-foreground size-8 [&_svg]:size-5 text-fd-muted-foreground"
                data-active="false"
              >
                <GithubIcon />
              </a>

              <a
                href="https://x.com/richard2wang"
                rel="noreferrer noopener"
                target="_blank"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 hover:bg-fd-accent hover:text-fd-accent-foreground size-8 [&_svg]:size-5 text-fd-muted-foreground"
                data-active="false"
              >
                <XIcon />
              </a>

              <a
                href="mailto:contact@richardwang.me"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 hover:bg-fd-accent hover:text-fd-accent-foreground size-8 [&_svg]:size-5 text-fd-muted-foreground"
                data-active="false"
              >
                <MailIcon />
              </a>
            </div>

            <ThemeSwitcher className="max-md:hidden" />

            <button
              className={cn(
                buttonVariants({
                  color: 'ghost',
                  size: 'icon-sm',
                  className:
                    '!size-8 [&_svg]:!size-5 text-fd-muted-foreground md:hidden',
                }),
              )}
              onClick={() => setOpen((prev) => !prev)}
            >
              <Menu animate={open} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
