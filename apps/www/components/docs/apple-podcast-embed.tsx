'use client';

import { cn } from '@workspace/ui/lib/utils';

interface ApplePodcastEmbedProps {
  podcastId: string;
  episodeId: string;
  country?: string;
  height?: number;
  className?: string;
}

export function ApplePodcastEmbed({
  podcastId,
  episodeId,
  country = 'cn',
  height = 175,
  className,
}: ApplePodcastEmbedProps) {
  const embedUrl = `https://embed.podcasts.apple.com/${country}/podcast/id${podcastId}?i=${episodeId}&theme=auto`;

  return (
    <div className={cn('w-full rounded-xl overflow-hidden bg-card not-prose', className)}>
      <iframe
        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
        height={height}
        className="w-full overflow-hidden rounded-xl border-0"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src={embedUrl}
        title="Apple Podcasts Player"
      />
    </div>
  );
}
