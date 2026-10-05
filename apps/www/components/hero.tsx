import { motion } from 'motion/react';
import { SplittingText } from '@/registry/primitives/texts/splitting';
import { Button } from '@workspace/ui/components/ui/button';
import Link from 'next/link';
import { MotionEffect } from './effects/motion-effect';
import { ArrowRightIcon } from '@/registry/icons/arrow-right';
import { AnimateIcon } from '@/registry/icons/icon';
import { LatestBlogs } from './latest-blogs';
import type { LatestContent } from '@/types/content';

const TITLE = "👋 Hi, I'm Richard Wang.";

type HeroProps = {
  latestContent: LatestContent[];
};

export const Hero = ({ latestContent }: HeroProps) => {
  return (
    <div className="relative overflow-hidden flex flex-col items-center px-5">
      <div className="relative z-10 flex flex-col items-center justify-center pt-40">
        <MotionEffect
          slide={{
            direction: 'down',
          }}
          fade
          zoom
          inView
          delay={0.15}
        >
          <div className="relative z-10">
            <h1 className="md:max-w-[900px] max-w-[340px]">
              <SplittingText
                text={TITLE}
                aria-hidden="true"
                className="block md:text-6xl text-5xl font-medium text-center text-neutral-200 dark:text-neutral-800"
                disableAnimation
              />
            </h1>
            <div className="md:max-w-[900px] max-w-[340px] absolute inset-0 flex items-center justify-center">
              <SplittingText
                text={TITLE}
                className="block md:text-6xl text-5xl font-medium text-center"
                type="chars"
                delay={400}
                initial={{ y: 0, opacity: 0, x: 0, filter: 'blur(10px)' }}
                animate={{ y: 0, opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </MotionEffect>

        <MotionEffect
          slide={{
            direction: 'down',
          }}
          fade
          zoom
          inView
          delay={0.3}
        >
          <p className="block font-normal md:text-lg sm:text-base text-sm text-center mt-6 text-muted-foreground md:max-w-[660px] sm:max-w-[450px] text-balance">
            求知，践行，分享。关于人工智能、数据科学、软件开发与自托管服务的实践笔记。
          </p>
        </MotionEffect>

        <div className="flex sm:flex-row flex-col sm:gap-4 gap-3 mt-8 mb-10 max-sm:w-full">
          <MotionEffect
            slide={{
              direction: 'down',
            }}
            fade
            zoom
            delay={0.45}
          >
            <AnimateIcon animateOnHover="out" completeOnStop asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full !pr-5"
                  variant="default"
                  asChild
                >
                  <Link href="/blog">
                    探索博客 <ArrowRightIcon className="!size-5" />
                  </Link>
                </Button>
              </motion.div>
            </AnimateIcon>
          </MotionEffect>

          <MotionEffect
            slide={{
              direction: 'down',
            }}
            fade
            zoom
            delay={0.6}
          >
            <AnimateIcon animateOnHover="out" completeOnStop asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="w-full"
                  variant="accent"
                  asChild
                >
                  <Link href="/projects">
                    项目展示 <ArrowRightIcon className="!size-5" />
                  </Link>
                </Button>
              </motion.div>
            </AnimateIcon>
          </MotionEffect>
        </div>

        <LatestBlogs content={latestContent} />
      </div>
    </div>
  );
};
