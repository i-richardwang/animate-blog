'use client';

// The About page's interests, each a titled carousel of photos that rises in
// as it scrolls into view.

import {
  Camera01Icon,
  Film01Icon,
  HeadphonesIcon,
  ServerIcon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { CarouselDots } from '@animate-ui/react/primitives/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'motion/react';
import Image from 'next/image';
import { riseInView } from '@/lib/motion';

interface InterestItem {
  image: string;
  caption: string;
}

interface Interest {
  icon: IconSvgElement;
  title: string;
  items: InterestItem[];
}

const INTERESTS: Interest[] = [
  {
    icon: SparklesIcon,
    title: '科幻爱好者',
    items: [
      {
        image: '/about/placeholder.webp',
        caption: '2006年开始在《科幻世界》上追读《三体》连载',
      },
      {
        image: '/about/placeholder.webp',
        caption: '最喜欢的作家：王晋康',
      },
    ],
  },
  {
    icon: Camera01Icon,
    title: '摄影器材党',
    items: [
      {
        image: '/about/placeholder.webp',
        caption: '10+台数码相机，10+支镜头',
      },
      {
        image: '/about/placeholder.webp',
        caption: '当前主力：富士XT4 + 35mm F1.4',
      },
    ],
  },
  {
    icon: ServerIcon,
    title: 'Self-Hosted 爱好者',
    items: [
      {
        image: '/about/placeholder.webp',
        caption: '初中起读《电脑报》《电脑爱好者》《微型计算机》',
      },
      {
        image: '/about/placeholder.webp',
        caption: '家庭网络：3x 2.5G + 1x 万兆交换机',
      },
      {
        image: '/about/placeholder.webp',
        caption: '自攒服务器 + 软路由 + NAS',
      },
    ],
  },
  {
    icon: HeadphonesIcon,
    title: '音乐发烧友',
    items: [
      {
        image: '/about/placeholder.webp',
        caption: '音响：KEF LSX',
      },
      {
        image: '/about/placeholder.webp',
        caption: '播放器：海贝 RS6',
      },
      {
        image: '/about/placeholder.webp',
        caption: '耳机：达音科 3001',
      },
      {
        image: '/about/placeholder.webp',
        caption: '耳放：拓品 DX7 Pro',
      },
    ],
  },
  {
    icon: Film01Icon,
    title: '电影爱好者',
    items: [
      {
        image: '/about/placeholder.webp',
        caption: '豆瓣标记超过 800 部影视作品',
      },
      {
        image: '/about/placeholder.webp',
        caption: '最常去的电影院：中国电影博物馆',
      },
    ],
  },
];

// The first interest shows as the page opens, so it takes its turn after the
// hero's title, line and portrait; the rest rise as they are scrolled to.
const AFTER_HERO = 3;

function InterestCard({
  interest,
  first,
}: {
  interest: Interest;
  first: boolean;
}) {
  return (
    <motion.section {...riseInView(first ? AFTER_HERO : 0)}>
      <div className="mb-12 flex items-center justify-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
          <HugeiconsIcon icon={interest.icon} strokeWidth={2} size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          {interest.title}
        </h2>
      </div>

      <div className="px-12">
        <Carousel
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
          opts={{ align: 'start', loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {interest.items.map((item) => (
              <CarouselItem
                key={item.caption}
                className="basis-1/2 pl-2 md:pl-4"
              >
                <div className="space-y-2">
                  <p className="min-h-10 text-center text-sm leading-relaxed text-foreground/80">
                    {item.caption}
                  </p>
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
                    <Image
                      src={item.image}
                      alt={item.caption}
                      fill
                      sizes="(min-width: 896px) 400px, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          {/* A lone dot says nothing: hide the dots when the slides all fit. */}
          <CarouselDots className="mt-4 text-muted-foreground [&:has([data-slot=carousel-dot]:only-of-type)]:hidden" />
        </Carousel>
      </div>
    </motion.section>
  );
}

export function AboutInterests() {
  return (
    <div className="px-5 pb-20">
      <div className="mx-auto max-w-4xl space-y-20">
        {INTERESTS.map((interest, index) => (
          <InterestCard
            key={interest.title}
            interest={interest}
            first={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
