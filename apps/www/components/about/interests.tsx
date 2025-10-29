'use client';

import { motion } from 'motion/react';
import { MotionEffect } from '@/components/effects/motion-effect';
import { Sparkles, Camera, Server, Headphones, Film } from 'lucide-react';
import { ImageGallery } from './image-gallery';

interface Interest {
  icon: React.ElementType;
  title: string;
  timeline: string;
  description: string;
  highlights?: string[];
  images?: string[]; // Array of image URLs
}

const INTERESTS: Interest[] = [
  {
    icon: Sparkles,
    title: 'Science Fiction Reader',
    timeline: '2010 - Present',
    description:
      'Fascinated by worlds beyond our own, from classic Asimov to modern Liu Cixin. Science fiction shapes how I think about technology, society, and the future of humanity.',
    highlights: [
      'Hard sci-fi enthusiast',
      'Foundation series favorite',
      'Annual reading goal: 20+ books',
    ],
    images: [],
  },
  {
    icon: Camera,
    title: 'Photography Hobbyist',
    timeline: '2015 - Present',
    description:
      'Started with a simple point-and-shoot, now shooting with a mirrorless setup. Street photography and landscapes are my main focus. The best camera is the one you have with you.',
    highlights: [
      'Street & landscape photography',
      'Mirrorless camera system',
      'Film photography experiments',
    ],
    images: [],
  },
  {
    icon: Server,
    title: 'Self-Hosting Tinkerer',
    timeline: '2012 - Present',
    description:
      'Running my own servers and services at home. From media servers to home automation, there\'s something satisfying about controlling your own digital infrastructure.',
    highlights: [
      'Home lab setup',
      'Docker enthusiast',
      'Privacy-focused solutions',
    ],
    images: [],
  },
  {
    icon: Headphones,
    title: 'Music Listener',
    timeline: '2008 - Present',
    description:
      'From discovering new artists on streaming platforms to diving deep into vinyl collecting. Music is a constant companion, whether working, traveling, or just relaxing.',
    highlights: [
      'Diverse genre tastes',
      'Vinyl collection growing',
      'Concert attendance: 30+ shows',
    ],
    images: [],
  },
  {
    icon: Film,
    title: 'Film Watcher',
    timeline: 'Always',
    description:
      'Enjoy everything from blockbusters to indie films, classic cinema to modern experimental works. Every film offers a different perspective and story to explore.',
    highlights: [
      '500+ films watched',
      'Criterion Collection fan',
      'Weekend movie marathons',
    ],
    images: [],
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
      delay={0.6 + 0.1 * index}
      inView
    >
      <motion.div
        className="relative dark:bg-neutral-800 bg-neutral-100 rounded-2xl p-6 sm:p-8"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Icon and Timeline Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <Icon className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">
                {interest.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {interest.timeline}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-foreground/80 leading-relaxed mb-4">
          {interest.description}
        </p>

        {/* Highlights */}
        {interest.highlights && interest.highlights.length > 0 && (
          <div className="space-y-2 mb-4">
            {interest.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-primary/60" />
                <span className="text-sm text-muted-foreground">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Image Gallery */}
        <ImageGallery images={interest.images} className="mt-4" />
      </motion.div>
    </MotionEffect>
  );
};

export const AboutInterests = () => {
  return (
    <div className="relative px-5 pb-20">
      <div className="max-w-4xl mx-auto">
        <MotionEffect
          slide={{
            direction: 'down',
          }}
          fade
          zoom
          delay={0.45}
          inView
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Things I Love
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A collection of passions, hobbies, and interests that have shaped my
            journey over the years.
          </p>
        </MotionEffect>

        <div className="space-y-6">
          {INTERESTS.map((interest, index) => (
            <InterestCard key={index} interest={interest} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

