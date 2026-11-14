'use client';

// The site's four sections as cards under the hero. They rise in one after
// the other once the intro is done, each growing in a little as it arrives,
// and an accent background slides to the card under the pointer. A press
// shrinks the card slightly, like the other cards on the site.

import { Highlight } from '@animate-ui/react/primitives/effects/highlight';
import { Dancing_Script } from 'next/font/google';
import { motion } from 'motion/react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Projects } from '@/components/icons/projects';
import { Blog } from '@/components/icons/blog';
import { Notes } from '@/components/icons/notes';
import { TokenUsage } from '@/components/icons/token-usage';
import { rise, useIntroDone } from './intro';

const dancing = Dancing_Script({ subsets: ['latin'] });

type FeatureItem = {
  name: string;
  description: string;
  href: string;
  icon: ReactNode;
};

const SECTIONS: FeatureItem[] = [
  {
    name: 'Projects',
    description: '项目展示',
    href: '/projects',
    icon: <Projects />,
  },
  {
    name: 'Blog',
    description: '博客文章',
    href: '/blog',
    icon: <Blog />,
  },
  {
    name: 'Notes',
    description: '学习笔记',
    href: '/docs',
    icon: <Notes />,
  },
  {
    name: 'Token',
    description: 'Token 用量',
    href: '/token-usage',
    icon: <TokenUsage />,
  },
];

// The cards follow the hero's blocks (title 0, subtitle 1, actions 2) and
// arrive half a step apart, each growing in from a little smaller.
const FIRST_CARD = 3;
const CARD_STEP = 0.5;
const CARD_FROM_SCALE = 0.94;

// The entrance and the press sit on separate elements: the entrance carries a
// delay that a press must not wait for.
function FeatureCard({ item, index }: { item: FeatureItem; index: number }) {
  const done = useIntroDone();
  return (
    <motion.div
      {...rise(FIRST_CARD + index * CARD_STEP, done, CARD_FROM_SCALE)}
      className="h-full"
    >
      <motion.div
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="h-full"
      >
        <Link
          href={item.href}
          className="relative block size-full overflow-hidden rounded-xl bg-accent/50"
        >
          <div className="flex flex-col items-center gap-1.5 px-4 pt-3 pb-1">
            <p
              className={cn(
                dancing.className,
                'text-[24px] font-black text-muted-foreground leading-none',
              )}
            >
              {item.name}
            </p>
            <p className="text-sm font-medium text-muted-foreground/70 leading-tight font-serif">
              {item.description}
            </p>
          </div>

          {item.icon}
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function Features() {
  return (
    <div className="relative mt-auto flex flex-col items-center justify-center px-5 pt-16 pb-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 xs:grid-cols-2 sm:max-lg:max-w-2xl lg:grid-cols-4">
        <Highlight
          hover
          className="inset-0 rounded-xl bg-accent"
          itemsClassName="h-full"
        >
          {SECTIONS.map((item, index) => (
            <FeatureCard key={item.name} item={item} index={index} />
          ))}
        </Highlight>
      </div>
    </div>
  );
}
