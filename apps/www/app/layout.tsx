import { RootProvider } from 'fumadocs-ui/provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Outfit } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import './globals.css';
import { jsonLd } from '@/lib/json-ld';
import { cn } from '@workspace/ui/lib/utils';
import { Analytics } from '@/lib/analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://richardwang.me'),
  title: {
    template: "%s - Richard's Page",
    default: "Richard's Page - Learning, Building, Sharing",
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
  authors: [
    {
      name: 'Richard Wang',
      url: 'https://github.com/i-richardwang',
    },
  ],
  publisher: "Richard's Page",
  openGraph: {
    title: "Richard's Page",
    description: '数字花园，记录技术探索的点滴',
    url: 'https://richardwang.me',
    siteName: "Richard's Page",
    images: [
      {
        url: 'https://richardwang.me/og-image.png',
        width: 1200,
        height: 630,
        alt: "Richard's Page",
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@richard2wang',
    title: "Richard's Page",
    description: '数字花园，记录技术探索的点滴',
    images: [
      {
        url: 'https://richardwang.me/og-image.png',
        width: 1200,
        height: 630,
        alt: "Richard's Page",
      },
    ],
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

      <body
        className={cn(
          'flex flex-col min-h-screen',
          // Allows to make more attractive video recordings
          // 'screenshot-mode',
        )}
      >
        <RootProvider theme={{ defaultTheme: 'dark' }}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
