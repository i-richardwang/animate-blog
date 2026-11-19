'use client';

// The home page's opening lines, rising into place word by word once the
// intro is done, with the two calls to action and the latest-content strip
// following at the same pace.

import { AnimateIcon } from '@animate-ui/react/icons';
import { Button } from '@animate-ui/react/primitives/buttons/button';
import { SplittingText } from '@animate-ui/react/primitives/texts/splitting';
import { motion } from 'motion/react';
import Link from 'next/link';
import { actionLinkClassName } from '@/components/action-link';
import { ArrowRight02Icon } from '@/components/animate-ui/icons/hugeicons/arrow-right-02';
import { RISE_WORDS, rise } from '@/lib/motion';
import { SITE } from '@/lib/site';
import type { LatestEntry } from '@/lib/source';
import { useIntroDone } from './intro';
import { LatestContent } from './latest-content';

const TITLE = "👋 Hi, I'm Richard Wang.";
// The subtitle breaks only between these phrases, never inside a word: it
// reads as two lines on desktop and three on a phone.
const SUBTITLE = [
  SITE.motto,
  '关于人工智能、',
  '数据科学、',
  '软件开发与自托管服务的实践笔记。',
];

function CallsToAction() {
  return (
    <div className="flex gap-3 max-sm:w-full max-sm:flex-col">
      <AnimateIcon animateOnHover="out" completeOnStop asChild>
        <Button asChild className={actionLinkClassName('primary')}>
          <Link href="/blog">
            探索博客 <ArrowRight02Icon />
          </Link>
        </Button>
      </AnimateIcon>
      <AnimateIcon animateOnHover="out" completeOnStop asChild>
        <Button asChild className={actionLinkClassName('secondary')}>
          <Link href="/projects">
            项目展示 <ArrowRight02Icon />
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
            {...RISE_WORDS}
          />
        ) : (
          <span className="invisible">{TITLE}</span>
        )}
      </h1>

      <motion.p
        {...rise(1, { shown: done })}
        className="mt-5 max-w-[620px] text-sm text-balance text-muted-foreground sm:text-base md:text-lg"
      >
        {SUBTITLE.map((phrase) => (
          <span key={phrase} className="inline-block">
            {phrase}
          </span>
        ))}
      </motion.p>

      <motion.div
        {...rise(2, { shown: done })}
        className="mt-8 flex w-full max-w-full flex-col items-center gap-4"
      >
        <CallsToAction />
        <LatestContent entries={latestContent} />
      </motion.div>
    </section>
  );
}
