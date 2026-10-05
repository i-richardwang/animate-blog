import { getLatestContent } from '@/lib/source';
import { HomePageClient } from './page-client';

export default function HomePage() {
  // Get latest content at build time (server component)
  const latestContent = getLatestContent(3);

  return <HomePageClient latestContent={latestContent} />;
}
