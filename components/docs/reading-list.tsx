'use client';

import { formatDate } from '@/lib/utils';
import { CardLink, CoverImage } from '@/components/docs/card-link';
import { Sparkles } from 'lucide-react';

interface Reading {
  url: string;
  title: string;
  description?: string;
  date: Date;
  author: {
    name: string;
    url?: string;
  };
  image: string;
}

interface ReadingListProps {
  readings: Reading[];
}

function FeaturedCard({ reading }: { reading: Reading }) {
  return (
    <CardLink
      href={reading.url}
      delay={0.2}
      className="group bg-card rounded-md overflow-hidden cursor-pointer"
    >
      <div className="flex flex-col md:flex-row">
        <CoverImage
          src={reading.image}
          alt={reading.title}
          className="w-full md:w-1/2 aspect-[16/9]"
        />

        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-6 px-2 bg-primary text-primary-foreground text-xs rounded flex gap-1 items-center justify-center">
              <Sparkles className="size-3" />
              本周推荐
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-medium group-hover:text-primary transition-colors line-clamp-2 mb-3">
            {reading.title}
          </h2>

          {reading.description && (
            <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-4">
              {reading.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{reading.author.name}</span>
            <span className="text-muted-foreground/50">·</span>
            <time dateTime={reading.date.toISOString()}>
              {formatDate(reading.date)}
            </time>
          </div>
        </div>
      </div>
    </CardLink>
  );
}

function ReadingCard({ reading, index }: { reading: Reading; index: number }) {
  return (
    <CardLink
      href={reading.url}
      delay={0.3 + index * 0.08}
      className="h-full group bg-card rounded-md overflow-hidden cursor-pointer"
    >
      <CoverImage
        src={reading.image}
        alt={reading.title}
        className="w-full aspect-[16/9]"
      />

      <div className="p-6">
        <h2 className="text-lg md:text-xl font-medium group-hover:text-primary transition-colors line-clamp-2 mb-3">
          {reading.title}
        </h2>

        {reading.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {reading.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{reading.author.name}</span>
          <time dateTime={reading.date.toISOString()}>
            {formatDate(reading.date)}
          </time>
        </div>
      </div>
    </CardLink>
  );
}

export function ReadingList({ readings }: ReadingListProps) {
  if (readings.length === 0) return null;

  const [featured, ...rest] = readings;

  return (
    <div className="space-y-8 not-prose">
      {featured && <FeaturedCard reading={featured} />}

      {rest.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-muted-foreground">
            往期推荐
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((reading, index) => (
              <ReadingCard key={reading.url} reading={reading} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
