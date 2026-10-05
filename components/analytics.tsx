'use client';

import Script from 'next/script';

// Umami (https://umami.is) page analytics, loaded only when configured.
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const script = process.env.NEXT_PUBLIC_UMAMI_SCRIPT;

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
