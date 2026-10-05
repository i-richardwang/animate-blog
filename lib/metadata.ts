import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

// Metadata for a section's index page, shared with the site preview image.
// Open Graph and Twitter objects replace the root layout's rather than merge
// with them, so every page spells them out in full.
export function sectionMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE.url}${path}`,
      siteName: SITE.name,
      type: 'website',
      locale: SITE.locale,
      images: [{ url: SITE.image, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitter,
      title,
      description,
      images: [SITE.image],
    },
  };
}

// Metadata for a single page with its own preview image.
export function pageMetadata({
  title,
  description,
  url,
  image,
  publishedTime,
  authors,
}: {
  title: string;
  description?: string;
  url: string;
  image: string;
  // Dated pages are articles; the rest are plain pages.
  publishedTime?: Date;
  authors?: Metadata['authors'];
}): Metadata {
  return {
    title,
    description,
    // Without authors the root layout's (the site owner) apply.
    ...(authors && { authors }),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: publishedTime ? 'article' : 'website',
      publishedTime: publishedTime?.toISOString(),
      locale: SITE.locale,
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitter,
      title,
      description,
      images: image,
    },
  };
}
