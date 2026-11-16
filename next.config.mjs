import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// The server is set up to stay small in memory, the scarce resource on the
// machine it runs on (see "Deployment" in the README).
/** @type {import('next').NextConfig} */
const config = {
  // The server never resizes an image: that decodes each one into tens of
  // megabytes of pixels that the allocator then keeps. Where Cloudflare
  // serves the site, its edge resizes them; anywhere else they are sent as
  // stored.
  images:
    process.env.CLOUDFLARE_IMAGE_TRANSFORMATIONS === 'true'
      ? {
          loader: 'custom',
          loaderFile: './lib/cloudflare-image-loader.ts',
        }
      : { unoptimized: true },
  // Prerendered pages are read from disk, without a second copy in memory.
  cacheMaxMemorySize: 0,
  experimental: {
    // A route's code is loaded on its first request rather than at start.
    preloadEntriesOnStart: false,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ];
  },
};

export default withMDX(config);
