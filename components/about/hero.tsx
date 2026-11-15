'use client';

// The About page's opening: the title rises word by word, then the line
// under it and the portrait follow, in the same motion as the home page.

import { SplittingText } from '@animate-ui/react/primitives/texts/splitting';
import { motion } from 'motion/react';
import Image from 'next/image';
import { RISE_WORDS, rise } from '@/lib/motion';

const TITLE = 'About Me';
const SUBTITLE = 'Learning, Building, Sharing.';

export function AboutHero() {
  return (
    <section className="flex flex-col items-center px-5 pt-40 pb-16 text-center">
      <h1 className="text-5xl font-medium md:text-6xl">
        <SplittingText
          type="words"
          text={TITLE}
          className="inline"
          {...RISE_WORDS}
        />
      </h1>

      <motion.p
        {...rise(1)}
        className="mt-6 text-sm text-balance text-muted-foreground sm:text-base md:text-lg"
      >
        {SUBTITLE}
      </motion.p>

      <motion.div
        {...rise(2)}
        className="mt-12 size-32 overflow-hidden rounded-full"
      >
        <Image
          src="/about/header-round.png"
          alt="Richard Wang"
          width={128}
          height={128}
          priority
          className="size-full object-cover"
        />
      </motion.div>
    </section>
  );
}
