'use client';

import * as React from 'react';
import { MotionEffect } from '@/components/effects/motion-effect';
import { Sparkles, Camera, Server, Headphones, Film } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@workspace/ui/components/carousel';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

interface InterestItem {
  image: string;
  caption: string;
}

interface Interest {
  icon: React.ElementType;
  title: string;
  items: InterestItem[];
}

const INTERESTS: Interest[] = [
  {
    icon: Sparkles,
    title: '科幻爱好者',
    items: [
      {
        image: '/og-image.png',
        caption: '2006年开始在《科幻世界》上追读《三体》连载',
      },
      {
        image: '/og-image.png',
        caption: '最喜欢的作家：王晋康',
      },
    ],
  },
  {
    icon: Camera,
    title: '摄影器材党',
    items: [
      {
        image: '/og-image.png',
        caption: '10+台数码相机，10+支镜头',
      },
      {
        image: '/og-image.png',
        caption: '当前主力：富士XT4 + 35mm F1.4',
      },
    ],
  },
  {
    icon: Server,
    title: 'Self-Hosted 爱好者',
    items: [
      {
        image: '/og-image.png',
        caption: '初中起读《电脑报》《电脑爱好者》《微型计算机》',
      },
      {
        image: '/og-image.png',
        caption: '家庭网络：3x 2.5G + 1x 万兆交换机',
      },
      {
        image: '/og-image.png',
        caption: '自攒服务器 + 软路由 + NAS',
      },
    ],
  },
  {
    icon: Headphones,
    title: '音乐发烧友',
    items: [
      {
        image: '/og-image.png',
        caption: '大学时代收藏：HD650、AKG K701、拜亚动力DT880',
      },
      {
        image: '/og-image.png',
        caption: '当前：AirPods Pro 2，从发烧到极简',
      },
    ],
  },
  {
    icon: Film,
    title: '电影爱好者',
    items: [
      {
        image: '/og-image.png',
        caption: '豆瓣标记 350+ 部影视作品',
      },
      {
        image: '/og-image.png',
        caption: '最常去的电影院：中国电影博物馆',
      },
    ],
  },
];

const InterestCard = ({
  interest,
  index,
}: {
  interest: Interest;
  index: number;
}) => {
  const Icon = interest.icon;

  return (
    <MotionEffect
      slide={{
        direction: 'up',
      }}
      fade
      zoom
      delay={0.2}
      inView
    >
      <div className="relative">
        {/* Icon and Title - Centered */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="size-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
            <Icon className="size-6" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground">
            {interest.title}
          </h3>
        </div>

        {/* Images Carousel */}
        <div className="px-12">
          <Carousel
            plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {interest.items.map((item, idx) => (
                <CarouselItem key={idx} className="pl-2 md:pl-4 basis-1/2">
                  <div className="space-y-2">
                    {/* Caption above image */}
                    <p className="text-sm text-foreground/80 leading-relaxed min-h-[2.5rem] text-center">
                      {item.caption}
                    </p>
                    {/* Image */}
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                      <Image
                        src={item.image}
                        alt={item.caption}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </MotionEffect>
  );
};

export const AboutInterests = () => {
  return (
    <div className="relative px-5 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-20">
          {INTERESTS.map((interest, index) => (
            <InterestCard key={index} interest={interest} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

