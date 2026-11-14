import { Features } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { HomeFooter } from '@/components/home/home-footer';
import { HomeHeader } from '@/components/home/home-header';
import { IntroProvider } from '@/components/home/intro';
import { getLatestContent } from '@/lib/source';

// The intro plays over the page (see components/home/intro.tsx); the header
// receives the logo at its end and the sections below rise in after it.
export default function HomePage() {
  return (
    <IntroProvider>
      <HomeHeader />
      <main className="flex min-h-dvh flex-col">
        <Hero latestContent={getLatestContent(3)} />
        <Features />
        <HomeFooter />
      </main>
    </IntroProvider>
  );
}
