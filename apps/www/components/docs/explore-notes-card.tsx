'use client';

import Link from 'next/link';
import { MotionEffect } from '@/components/effects/motion-effect';
import { motion } from 'motion/react';
import { ArrowRightIcon } from '@/registry/icons/arrow-right';
import { LightbulbIcon } from '@/registry/icons/lightbulb';
import { AnimateIcon } from '@/registry/icons/icon';

export function ExploreNotesCard() {
  return (
    <MotionEffect
      slide={{ direction: 'down', offset: 30 }}
      fade
      inView
      delay={0.1}
    >
      <AnimateIcon animateOnHover asChild>
        <Link href="/docs">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-11 px-4 transition-colors"
          >
            <LightbulbIcon className="size-[18px]" />
            <span className="text-[15px]">博客偏思考总结，更多实践内容在笔记中</span>
            <ArrowRightIcon animation="out" className="size-4" />
          </motion.div>
        </Link>
      </AnimateIcon>
    </MotionEffect>
  );
}
