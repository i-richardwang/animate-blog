'use client';

import Script from 'next/script';

/**
 * Umami Analytics
 *
 * https://umami.is
 */
export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID as string;
  const script = process.env.NEXT_PUBLIC_UMAMI_SCRIPT as string;

  if (!websiteId || !script) {
    return null;
  }

  return (
    <Script
      async
      type="text/javascript"
      data-website-id={websiteId}
      src={script}
    />
  );
}
