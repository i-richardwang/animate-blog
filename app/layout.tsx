import { RootProvider } from 'fumadocs-ui/provider/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Outfit } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import './globals.css';
import { SITE, SITE_AUTHOR } from '@/lib/site';
import { jsonLd } from '@/lib/json-ld';
import { Analytics } from '@/components/analytics';

const OG_IMAGE = { url: SITE.image, width: 1200, height: 630, alt: SITE.name };

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    template: `%s - ${SITE.name}`,
    default: `${SITE.name} - Learning, Building, Sharing`,
  },
  description:
    'A personal blog and knowledge base for learning, exploration, and sharing insights.',
  keywords: [
    'Personal Blog',
    'Knowledge Base',
    'Learning Notes',
    'Tech Blog',
    'Digital Garden',
  ],
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
  ],
  authors: [SITE_AUTHOR],
  publisher: SITE.name,
  alternates: {
    types: {
      'application/rss+xml': [
        {
          title: `${SITE.name} - All Updates`,
          url: `${SITE.url}/rss.xml`,
        },
      ],
    },
  },
  openGraph: {
    title: SITE.name,
    description: '数字花园，记录技术探索的点滴',
    url: SITE.url,
    siteName: SITE.name,
    images: [OG_IMAGE],
    locale: SITE.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitter,
    title: SITE.name,
    description: '数字花园，记录技术探索的点滴',
    images: [OG_IMAGE],
  },
};

const outfit = Outfit({ subsets: ['latin'] });

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh" className={outfit.className} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className="flex flex-col min-h-screen">
        <RootProvider theme={{ defaultTheme: 'system' }}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
