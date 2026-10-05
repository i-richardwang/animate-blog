'use client';

import {
  RotatingText,
  RotatingTextContainer,
  useRotatingText,
} from '@/components/animate-ui/primitives/texts/rotating';
import { MotionEffect } from '@/components/motion-effect';
import Link from 'next/link';
import { SendHorizontalIcon } from '@/components/animate-ui/icons/send-horizontal';
import { PartyPopper } from '@/components/animate-ui/icons/party-popper';
import { useEffect, useState } from 'react';
import type { LatestEntry } from '@/lib/source';

const SyncedSendIcon = () => {
  const { currentText } = useRotatingText();
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [currentText]);

  return (
    <SendHorizontalIcon
      key={animateKey}
      animation="default"
      animate
      className="size-5 flex-shrink-0"
    />
  );
};

// Links the title currently shown, which is always one of `entries`.
const CurrentEntryLink = ({ entries }: { entries: LatestEntry[] }) => {
  const { currentText } = useRotatingText();
  const currentItem = entries.find((entry) => entry.title === currentText)!;

  return (
    <Link href={currentItem.url} className="block group">
      <RotatingText className="font-medium text-foreground/80 group-hover:text-foreground text-sm sm:text-base line-clamp-1 transition-colors underline decoration-foreground/30 group-hover:decoration-foreground/60 underline-offset-4" />
    </Link>
  );
};

// The newest posts and notes, rotating in a strip below the hero.
export const LatestContent = ({ entries }: { entries: LatestEntry[] }) => {
  if (entries.length === 0) return null;

  return (
    <MotionEffect
      slide={{
        direction: 'down',
      }}
      fade
      zoom
      delay={0.75}
    >
      <div className="bg-card rounded-md h-11 px-4 md:w-[576px] w-full max-w-full mx-auto">
        <div className="flex items-center gap-3 h-full">
          <span className="h-6 px-2 bg-primary text-xs text-primary-foreground rounded flex gap-1 items-center justify-center whitespace-nowrap">
            Latest
            <PartyPopper delay={500} className="size-3.5" animate />
          </span>

          <RotatingTextContainer
            text={entries.map((entry) => entry.title)}
            duration={4000}
            inView
            inViewOnce={false}
            className="flex-1 text-left flex items-center gap-3"
          >
            <SyncedSendIcon />
            <CurrentEntryLink entries={entries} />
          </RotatingTextContainer>
        </div>
      </div>
    </MotionEffect>
  );
};
