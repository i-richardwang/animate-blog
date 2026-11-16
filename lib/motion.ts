import { ease, motionTokens } from '@animate-ui/react/utils/motion';

// The site's entrance: content rises a little into place out of a blur. A
// page's title rises word by word (RISE_WORDS, for SplittingText) and the
// blocks under it follow one after the other (`rise`, or `riseInView` for a
// block further down the page). The cards of a row come out of the same blur
// in the same order, but each springs up into place (`riseCard`).

const DURATION = 0.7;
const STAGGER = 0.18;

export const RISE_WORDS = {
  initial: { opacity: 0, y: 24, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: DURATION, ease: ease.out },
  stagger: 0.07,
};

const HIDDEN = { opacity: 0, y: 20, filter: 'blur(10px)' };

// Once settled the blur is dropped, so the block is not left as its own
// filter layer.
const SETTLED = {
  opacity: 1,
  y: 0,
  filter: 'blur(0px)',
  transitionEnd: { filter: 'none' },
};

const eased = (delay: number) => ({
  duration: DURATION,
  ease: ease.out,
  delay,
});

// Motion props for a block that rises into place as the page opens. `index`
// is the block's place in the order, counting from the title at 0, and sets
// its delay. While `shown` is false the block is held hidden, for a page that
// reveals itself at a moment of its own (the home page, after its intro).
export function rise(
  index: number,
  { shown = true }: { shown?: boolean } = {},
) {
  return {
    initial: HIDDEN,
    animate: shown ? SETTLED : HIDDEN,
    transition: eased(index * STAGGER),
  };
}

// Motion props for a block that rises once it is scrolled into view.
export function riseInView(index: number) {
  return {
    initial: HIDDEN,
    whileInView: SETTLED,
    viewport: { once: true, margin: '-80px' },
    transition: eased(index * STAGGER),
  };
}

// A card comes from further below and from half its size, on the spring of
// Animate UI's own entrances, so that it lands with a little bounce. Its
// opacity and blur stay on the blocks' curve: a spring would carry them past
// their end.
const CARD_HIDDEN = { ...HIDDEN, y: 100, scale: 0.5 };
const CARD_SETTLED = { ...SETTLED, scale: 1 };
const CARD_GAP = 0.15;

// Motion props for a card of a row that springs up as the page opens. `index`
// is the row's place among the page's blocks and `place` the card's place in
// the row: the cards arrive one after the other.
export function riseCard(
  index: number,
  place: number,
  { shown = true }: { shown?: boolean } = {},
) {
  const delay = index * STAGGER + place * CARD_GAP;
  const sprung = { ...motionTokens.spring.entrance, delay };
  return {
    initial: CARD_HIDDEN,
    animate: shown ? CARD_SETTLED : CARD_HIDDEN,
    transition: { ...eased(delay), y: sprung, scale: sprung },
  };
}
