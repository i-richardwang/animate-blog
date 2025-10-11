import { motion } from 'motion/react';
import { SplittingText } from '@/registry/primitives/texts/splitting';
import { Button } from '@workspace/ui/components/ui/button';
import Link from 'next/link';
import { MotionEffect } from './effects/motion-effect';
import { ArrowRightIcon } from '@/registry/icons/arrow-right';
import { AnimateIcon } from '@/registry/icons/icon';
import { LatestBlogs } from './latest-blogs';

const TITLE = "👋 Hi, I'm Richard Wang.";

export const Hero = () => {
  return (
    <div className="relative overflow-x-hidden flex flex-col items-center px-5">
      <div className="relative z-10 flex flex-col items-center justify-center pt-40">
        {/* Original banner (commented out for cleaner design) */}
        {/* <MotionEffect
          slide={{
            direction: 'down',
          }}
          fade
          zoom
          inView
        >
          <div className="mb-8 rounded-full bg-accent py-1.5 px-4 text-sm flex items-center gap-2">
            <span className="text-neutral-600 dark:text-neutral-400">
              Learning, Building, Sharing
            </span>
          </div>
        </MotionEffect> */}

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
            Learning, Building, Sharing. A personal digital space for
            documenting my journey in AI, data science, and software
            development.
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
                  <Link href="/docs">
                    Explore Notes <ArrowRightIcon className="!size-5" />
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="w-full" variant="accent" asChild>
                <Link href="/blog">Read Blog</Link>
              </Button>
            </motion.div>
          </MotionEffect>
        </div>

        {/* Original tech stack icons (commented out for upstream sync) */}
        {/* <div className="flex items-center gap-4 justify-center sm:justify-start">
          {ICONS.map((Icon, index) => (
            <MotionEffect
              key={index}
              slide={{
                direction: 'down',
              }}
              fade
              zoom
              delay={0.75 + index * 0.1}
            >
              <Icon className="size-8" />
            </MotionEffect>
          ))}
        </div> */}

        <LatestBlogs />
      </div>
    </div>
  );
};
