'use client';

// The home page's header: the logo lands here at the end of the intro, and
// the links at the right fade in behind it.

import { ease } from '@animate-ui/react/utils/motion';
import { motion } from 'motion/react';
import Link from 'next/link';
import { SocialLinks } from '@/components/social-links';
import { ThemeToggle } from '@/components/theme-toggle';
import { visibleSections } from '@/lib/navigation';
import { SITE } from '@/lib/site';
import { FullLogo, LOGO_GLIDE, useIntroPlaying } from './intro';

export function HomeHeader() {
  const playing = useIntroPlaying();

  return (
    <header
      data-slot="home-header"
      className="fixed inset-x-0 top-0 z-70 h-20 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-5">
        <Link href="/" aria-label={SITE.name} className="flex items-center">
          {!playing && (
            <motion.div
              layoutId="home-logo"
              transition={{ layout: LOGO_GLIDE }}
              className="h-6 text-foreground md:h-7"
            >
              <FullLogo className="h-full w-auto" />
            </motion.div>
          )}
        </Link>

        <motion.div
          className="ml-auto flex items-center gap-1"
          initial={false}
          animate={
            playing
              ? { opacity: 0, x: 24, filter: 'blur(6px)' }
              : { opacity: 1, x: 0, filter: 'blur(0px)' }
          }
          transition={{ duration: 0.6, ease: ease.out, delay: 0.25 }}
        >
          <nav className="mr-1 flex items-center">
            {visibleSections.map((section) => (
              <Link
                key={section.url}
                href={section.url}
                className="hidden h-8 items-center rounded-md px-3 text-sm text-neutral-700 transition-colors hover:text-black md:inline-flex dark:text-neutral-200 dark:hover:text-white"
              >
                {section.title}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center xs:flex">
            <SocialLinks linkClassName="size-8" />
          </div>
          <ThemeToggle />
        </motion.div>
      </div>
    </header>
  );
}
