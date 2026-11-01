'use client';

// The site's four sections as cards under the hero, rising in with the
// rest of the page. One accent background slides to the card under the
// pointer.

import { Highlight } from '@animate-ui/react/primitives/effects/highlight';
import { Dancing_Script } from 'next/font/google';
import { motion } from 'motion/react';
import Link from 'next/link';
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
  icon: React.ReactNode;
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

const FeatureCard = ({ item }: { item: FeatureItem }) => {
  return (
    <Link
      href={item.href}
      className="relative block h-full w-full overflow-hidden rounded-xl bg-accent/50"
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
  );
};

export const Features = () => {
  const done = useIntroDone();
  return (
    <motion.div
      {...rise(6, done)}
      className="relative mt-auto flex flex-col items-center justify-center px-5 pt-16 pb-10"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 xs:grid-cols-2 sm:max-lg:max-w-2xl lg:grid-cols-4">
        <Highlight
          hover
          className="inset-0 rounded-xl bg-accent"
          itemsClassName="h-full"
        >
          {SECTIONS.map((item) => (
            <FeatureCard key={item.name} item={item} />
          ))}
        </Highlight>
      </div>
    </motion.div>
  );
};
