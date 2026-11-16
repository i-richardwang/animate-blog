'use client';

import type { ImageLoaderProps } from 'next/image';

// The next/image loader used where Cloudflare serves the site (see `images`
// in next.config.mjs). Cloudflare resizes the image at its edge and caches
// the result, so the server only ever sends the stored file, once:
//   /cdn-cgi/image/width=1080,format=auto,onerror=redirect/blogs/a.png
// `format=auto` picks AVIF or WebP by browser. `onerror=redirect` sends the
// stored file when Cloudflare cannot transform one, as when the plan's
// monthly allowance is used up.
export default function cloudflareImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  // Sent as stored: vector images and animations, which are not resized,
  // and images on other hosts, which Cloudflare does not fetch.
  if (!src.startsWith('/') || /\.(svg|gif)$/i.test(src)) return src;

  const options = [`width=${width}`, 'format=auto', 'onerror=redirect'];
  // Cloudflare's default quality, 85, applies unless the image asks for one.
  if (quality) options.push(`quality=${quality}`);
  return `/cdn-cgi/image/${options.join(',')}${src}`;
}
