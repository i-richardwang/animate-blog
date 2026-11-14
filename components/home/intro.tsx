'use client';

// The home page's opening: the logo draws itself on a blank screen, fills,
// holds a beat, then glides into the header while the page rises in beneath
// it. Under reduced motion there is no intro and the page is simply there.
// `useIntroDone` tells the rest of the page when to appear.

import { ease, useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { AnimatePresence, motion } from 'motion/react';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { DrawingLogo, LOGO_END, STROKES_END } from './logo';

// Seconds from the first stroke: the finished logo holds, then glides into the
// header, and the page starts to rise once the glide is under way.
const HOLD = 0.3;
const GLIDE = 0.75;
const GLIDE_AT = LOGO_END + HOLD;
const RISE_AT = GLIDE_AT + GLIDE * 0.45;
const VEIL_FADE = GLIDE * 0.8;

// The glow behind the logo swells as the strokes finish and peaks at this
// fraction of the time before the glide.
const GLOW_PEAK = 0.85;

export const LOGO_GLIDE = {
  type: 'spring',
  stiffness: 150,
  damping: 24,
  mass: 0.9,
} as const;

const IntroContext = createContext({ playing: false, done: true });

export function useIntroDone() {
  return use(IntroContext).done;
}

export function useIntroPlaying() {
  return use(IntroContext).playing;
}

const RISE_STAGGER = 0.18;

// Motion props for a block that rises into place once the intro is done.
// The blocks rise top to bottom, `index` counting from the title (the title
// itself is the hero's word-by-word SplittingText); an index can be
// fractional to space a row of blocks more tightly. `scale` is the size a
// block grows from. The blur is dropped once it has settled, so a finished
// block is not left as its own filter layer.
export const rise = (index: number, done: boolean, scale = 1) => {
  const hidden = { opacity: 0, y: 20, scale, filter: 'blur(10px)' };
  return {
    initial: hidden,
    animate: done
      ? {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transitionEnd: { filter: 'none' },
        }
      : hidden,
    transition: { duration: 0.7, ease: ease.out, delay: index * RISE_STAGGER },
  };
};

export function IntroProvider({ children }: { children: ReactNode }) {
  const reduce = useShouldReduceMotion();
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const glide = setTimeout(() => setPlaying(false), GLIDE_AT * 1000);
    const rising = setTimeout(() => {
      root.style.overflow = '';
      setDone(true);
    }, RISE_AT * 1000);
    return () => {
      clearTimeout(glide);
      clearTimeout(rising);
      root.style.overflow = '';
    };
  }, [reduce]);

  const intro = playing && !reduce;

  return (
    <IntroContext value={{ playing: intro, done: done || reduce }}>
      <AnimatePresence>
        {intro && (
          <motion.div
            key="intro"
            data-slot="home-intro"
            aria-hidden="true"
            className="fixed inset-0 z-60 flex items-center justify-center bg-background"
            exit={{
              opacity: 0,
              transition: { duration: VEIL_FADE, ease: ease.out },
            }}
          >
            <motion.div
              className="absolute size-[60vmin] rounded-full bg-foreground/10 blur-3xl"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0, 1, 0.6], scale: [0.4, 0.4, 1.1, 1] }}
              transition={{
                duration: GLIDE_AT,
                times: [0, STROKES_END / GLIDE_AT, GLOW_PEAK, 1],
                ease: ease.out,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {intro && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-61 flex items-center justify-center"
        >
          <motion.div
            layoutId="home-logo"
            transition={{ layout: LOGO_GLIDE }}
            className="w-[min(78vw,640px)] text-foreground"
          >
            <DrawingLogo />
          </motion.div>
        </div>
      )}
      {children}
    </IntroContext>
  );
}
