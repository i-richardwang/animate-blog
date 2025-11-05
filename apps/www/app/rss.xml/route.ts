import { getRSS } from '@/lib/rss';

export const revalidate = false;

export function GET() {
  const rss = getRSS();

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

