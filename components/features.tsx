import { Dancing_Script } from 'next/font/google';
import { Effect } from '@/components/animate-ui/primitives/effects/effect';
import { cn } from '@/lib/utils';
import { Projects } from './icons/projects';
import { Blog } from './icons/blog';
import { Notes } from './icons/notes';
import { TokenUsage } from './icons/token-usage';
import Link from 'next/link';
import { motion } from 'motion/react';

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

const FeatureCard = ({ item, index }: { item: FeatureItem; index: number }) => {
  return (
    <Effect slide fade zoom delay={1000 + 150 * index}>
      <Link href={item.href}>
        <motion.div
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.925 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
          className="relative w-full bg-card rounded-md overflow-hidden"
        >
          <div className="pt-3 pb-1 px-4 flex flex-col items-center gap-1.5">
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
        </motion.div>
      </Link>
    </Effect>
  );
};

export const Features = () => {
  return (
    <div className="relative pt-16 pb-10 px-5 flex flex-col items-center justify-center mt-auto">
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-4 w-full max-w-7xl sm:max-lg:max-w-2xl mx-auto">
        {SECTIONS.map((item, index) => (
          <FeatureCard key={item.name} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};
