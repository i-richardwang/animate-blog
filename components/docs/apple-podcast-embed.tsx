export function ApplePodcastEmbed({
  podcastId,
  episodeId,
}: {
  podcastId: string;
  episodeId: string;
}) {
  const embedUrl = `https://embed.podcasts.apple.com/cn/podcast/id${podcastId}?i=${episodeId}&theme=auto`;

  return (
    <div className="w-full rounded-xl overflow-hidden bg-card not-prose">
      <iframe
        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
        height={175}
        className="w-full overflow-hidden rounded-xl border-0"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src={embedUrl}
        title="Apple Podcasts Player"
      />
    </div>
  );
}
