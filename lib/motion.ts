import { ease } from '@animate-ui/react/utils/motion';

// The site's entrance: content rises a little into place out of a blur. A
// page's title rises word by word (RISE_WORDS, for SplittingText) and the
// blocks under it follow one after the other (`rise`, or `riseInView` for a
// block further down the page).

const DURATION = 0.7;
const STAGGER = 0.18;

export const RISE_WORDS = {
  initial: { opacity: 0, y: 24, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: DURATION, ease: ease.out },
  stagger: 0.07,
};

// `scale` is the size a block grows from. Once settled the blur is dropped,
// so the block is not left as its own filter layer.
const hidden = (scale = 1) => ({
  opacity: 0,
  y: 20,
  scale,
  filter: 'blur(10px)',
});

const SETTLED = {
  opacity: 1,
  y: 0,
  scale: 1,
  filter: 'blur(0px)',
  transitionEnd: { filter: 'none' },
};

// `index` is a block's place in the order, counting from the title at 0, and
// sets its delay; it can be fractional to space a row of blocks more tightly.
const after = (index: number) => ({
  duration: DURATION,
  ease: ease.out,
  delay: index * STAGGER,
});

// Motion props for a block that rises into place as the page opens. While
// `shown` is false it is held hidden, for a page that reveals itself at a
// moment of its own (the home page, after its intro).
export function rise(
  index: number,
  { shown = true, scale = 1 }: { shown?: boolean; scale?: number } = {},
) {
  return {
    initial: hidden(scale),
    animate: shown ? SETTLED : hidden(scale),
    transition: after(index),
  };
}

// Motion props for a block that rises once it is scrolled into view.
export function riseInView(index: number) {
  return {
    initial: hidden(),
    whileInView: SETTLED,
    viewport: { once: true, margin: '-80px' },
    transition: after(index),
  };
}
