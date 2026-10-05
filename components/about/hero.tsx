'use client';

import { motion } from 'motion/react';
import { SplittingText } from '@/components/animate-ui/primitives/texts/splitting';
import { Effect } from '@/components/animate-ui/primitives/effects/effect';
import Image from 'next/image';

const TITLE = 'About Me';
const SUBTITLE = 'Learning, Building, Sharing.';

export const AboutHero = () => {
  return (
    <div className="relative overflow-x-hidden flex flex-col items-center px-5 pt-40 pb-16">
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto">
        <Effect slide fade zoom inView delay={150}>
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
        </Effect>

        <Effect slide fade zoom inView delay={300}>
          <p className="block font-normal md:text-lg sm:text-base text-sm text-center mt-6 text-muted-foreground md:max-w-[660px] sm:max-w-[450px] text-balance">
            {SUBTITLE}
          </p>
        </Effect>

        {/* Avatar */}
        <Effect slide fade zoom delay={450}>
          <div className="mt-12 relative">
            <motion.div
              className="size-32 rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Image
                src="/about/header-round.png"
                alt="Richard Wang"
                width={128}
                height={128}
                className="size-full object-cover"
              />
            </motion.div>
          </div>
        </Effect>
      </div>
    </div>
  );
};
