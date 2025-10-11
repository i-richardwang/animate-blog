'use client';

import {
  RotatingText,
  RotatingTextContainer,
  useRotatingText,
} from '@/registry/primitives/texts/rotating';
import { MotionEffect } from './effects/motion-effect';
import Link from 'next/link';
import { SendHorizontalIcon } from '@/registry/icons/send-horizontal';
import { PartyPopper } from '@/registry/icons/party-popper';
import { useEffect, useState } from 'react';

const LATEST_BLOGS = [
  {
    title: 'Building a Personal Site with Animate UI',
    url: '/blog/building-personal-site-with-animate-ui',
  },
  {
    title: 'Welcome to My Digital Garden',
    url: '/blog/welcome-to-animate-ui',
  },
  {
    title: 'Building Animated Interfaces with Motion',
    url: '/blog/building-animated-interfaces',
  },
];

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

const BlogLink = () => {
  const { currentText } = useRotatingText();
  const currentBlog = LATEST_BLOGS.find((blog) => blog.title === currentText);

  if (!currentBlog) {
    return (
      <RotatingText className="font-medium text-foreground/80 text-sm sm:text-base line-clamp-1" />
    );
  }

  return (
    <Link href={currentBlog.url} className="block group">
      <RotatingText className="font-medium text-foreground/80 group-hover:text-foreground text-sm sm:text-base line-clamp-1 transition-colors underline decoration-foreground/30 group-hover:decoration-foreground/60 underline-offset-4" />
    </Link>
  );
};

export const LatestBlogs = () => {
  return (
    <MotionEffect
      slide={{
        direction: 'down',
      }}
      fade
      zoom
      delay={0.75}
    >
      <div className="dark:bg-neutral-800 bg-neutral-100 rounded-2xl h-11 px-4 md:w-[576px] w-full max-w-full mx-auto">
        <div className="flex items-center gap-3 h-full">
          <span className="h-6 px-2 bg-primary text-xs text-primary-foreground rounded-full flex gap-1 items-center justify-center whitespace-nowrap">
            Latest
            <PartyPopper delay={500} className="size-3.5" animate />
          </span>

          <RotatingTextContainer
            text={LATEST_BLOGS.map((blog) => blog.title)}
            duration={4000}
            inView
            inViewOnce={false}
            className="flex-1 text-left flex items-center gap-3"
          >
            <SyncedSendIcon />
            <BlogLink />
          </RotatingTextContainer>
        </div>
      </div>
    </MotionEffect>
  );
};
