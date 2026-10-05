'use client';

import Link from 'next/link';
import { Effect } from '@/components/animate-ui/primitives/effects/effect';
import { motion } from 'motion/react';
import { ArrowRightIcon } from '@/components/animate-ui/icons/arrow-right';
import { LightbulbIcon } from '@/components/animate-ui/icons/lightbulb';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';

export function ExploreNotesCard() {
  return (
    <Effect slide={{ offset: 30 }} fade inView delay={100}>
      <AnimateIcon animateOnHover asChild>
        <Link href="/docs">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-11 px-4 transition-colors"
          >
            <LightbulbIcon className="size-[18px]" />
            <span className="text-[15px]">
              博客偏思考总结，更多实践内容在笔记中
            </span>
            <ArrowRightIcon animation="out" className="size-4" />
          </motion.div>
        </Link>
      </AnimateIcon>
    </Effect>
  );
}
