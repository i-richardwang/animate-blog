'use client';

import Link from 'next/link';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { motion } from 'motion/react';
import { ArrowRight02Icon } from '@/components/animate-ui/icons/hugeicons/arrow-right-02';
import { LightbulbIcon } from '@/components/animate-ui/icons/hugeicons/lightbulb';
import { AnimateIcon } from '@animate-ui/react/icons';

export function ExploreNotesCard() {
  return (
    <Effect slide={{ offset: 30 }} fade inView delay={100}>
      <AnimateIcon animateOnHover asChild>
        <Link href="/docs">
          <motion.div
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md min-h-11 px-4 py-2.5 transition-colors"
          >
            <LightbulbIcon className="size-[18px] shrink-0" />
            {/* Wraps between the two clauses on a phone, never inside one. */}
            <span className="text-[15px] leading-snug">
              <span className="inline-block">博客偏思考总结，</span>
              <span className="inline-block">更多实践内容在笔记中</span>
            </span>
            <ArrowRight02Icon animation="out" className="size-4 shrink-0" />
          </motion.div>
        </Link>
      </AnimateIcon>
    </Effect>
  );
}
