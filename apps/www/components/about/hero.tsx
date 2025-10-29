import { motion } from 'motion/react';
import { SplittingText } from '@/registry/primitives/texts/splitting';
import { MotionEffect } from '@/components/effects/motion-effect';

const TITLE = 'About Me';
const SUBTITLE =
  'Developer, designer, and digital creator. Building things on the internet and sharing what I learn along the way.';

export const AboutHero = () => {
  return (
    <div className="relative overflow-x-hidden flex flex-col items-center px-5 pt-40 pb-16">
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto">
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
            {SUBTITLE}
          </p>
        </MotionEffect>

        {/* Avatar placeholder - you can add image here */}
        <MotionEffect
          slide={{
            direction: 'down',
          }}
          fade
          zoom
          delay={0.45}
        >
          <div className="mt-12 relative">
            <motion.div
              className="size-32 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center text-4xl font-bold text-neutral-600 dark:text-neutral-400"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Replace with <img src="..." /> or keep as placeholder */}
              RW
            </motion.div>
          </div>
        </MotionEffect>
      </div>
    </div>
  );
};

