'use client';

// The home page's opening lines, rising into place word by word once the
// intro is done, with the two calls to action and the latest-content strip
// following at the same pace.

import { AnimateIcon } from '@animate-ui/react/icons';
import { Button } from '@animate-ui/react/primitives/buttons/button';
import { SplittingText } from '@animate-ui/react/primitives/texts/splitting';
import { ease } from '@animate-ui/react/utils/motion';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/animate-ui/icons/arrow-right';
import type { LatestEntry } from '@/lib/source';
import { rise, useIntroDone } from './intro';
import { LatestContent } from './latest-content';

const TITLE = "👋 Hi, I'm Richard Wang.";
const SUBTITLE =
  '求知，践行，分享。关于人工智能、数据科学、软件开发与自托管服务的实践笔记。';

const WORD_IN = {
  initial: { opacity: 0, y: 24, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.7, ease: ease.out },
  stagger: 0.07,
};

const button =
  'inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors [&_svg]:size-4';

function CallsToAction() {
  return (
    <div className="flex gap-3 max-sm:w-full max-sm:flex-col">
      <AnimateIcon animateOnHover="out" completeOnStop asChild>
        <Button
          asChild
          className={`${button} bg-primary text-primary-foreground hover:bg-primary/85`}
        >
          <Link href="/blog">
            探索博客 <ArrowRightIcon />
          </Link>
        </Button>
      </AnimateIcon>
      <AnimateIcon animateOnHover="out" completeOnStop asChild>
        <Button asChild className={`${button} bg-accent hover:bg-accent/70`}>
          <Link href="/projects">
            项目展示 <ArrowRightIcon />
          </Link>
        </Button>
      </AnimateIcon>
    </div>
  );
}

export function Hero({ latestContent }: { latestContent: LatestEntry[] }) {
  const done = useIntroDone();
  return (
    <section className="flex flex-col items-center px-5 pt-36 text-center md:pt-44">
      <h1 className="max-w-[860px] text-4xl font-medium text-balance md:text-6xl">
        {done ? (
          <SplittingText
            type="words"
            text={TITLE}
            className="inline"
            {...WORD_IN}
          />
        ) : (
          <span className="invisible">{TITLE}</span>
        )}
      </h1>

      <motion.p
        {...rise(1, done)}
        className="mt-5 max-w-[620px] text-sm text-balance text-muted-foreground sm:text-base md:text-lg"
      >
        {SUBTITLE}
      </motion.p>

      <motion.div
        {...rise(2, done)}
        className="mt-8 flex w-full max-w-full flex-col items-center gap-4"
      >
        <CallsToAction />
        <LatestContent entries={latestContent} />
      </motion.div>
    </section>
  );
}
