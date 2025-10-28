'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AboutHero } from '@/components/about/hero';
import { AboutInterests } from '@/components/about/interests';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';
import { cn } from '@workspace/ui/lib/utils';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const CONTENT_VARIANTS = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 30 },
  },
} as const;

export default function AboutPage() {
  const [transition, setTransition] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTransition(true), 1250);
    const timer2 = setTimeout(() => setIsLoaded(true), 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <main className={cn('relative min-h-dvh', !isLoaded && 'overflow-y-hidden')}>
        <Header transition={transition} />

        <div className="w-full flex flex-col min-h-dvh">
          {transition && (
            <>
              <motion.div
                variants={CONTENT_VARIANTS}
                initial="hidden"
                animate={transition ? 'visible' : 'hidden'}
                className="w-full flex-1"
              >
                <AboutHero />
                <AboutInterests />
              </motion.div>

              <Footer />
            </>
          )}
        </div>
      </main>
    </>
  );
}

