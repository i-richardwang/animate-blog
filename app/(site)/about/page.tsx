import { AboutHero } from '@/components/about/hero';
import { AboutInterests } from '@/components/about/interests';
import { sectionMetadata } from '@/lib/metadata';

export const metadata = sectionMetadata({
  title: 'About Me',
  description:
    'Learning, Building, Sharing. 科幻爱好者、摄影器材党、Self-Hosted 实践者、音乐发烧友、电影爱好者。',
  path: '/about',
});

export default function AboutPage() {
  // This page renders its own sections rather than a <DocsPage />, so it has
  // to claim the layout grid's main area itself — otherwise the docs grid
  // auto-places it in the (zero-width) sidebar column.
  return (
    <div className="w-full min-w-0 [grid-area:main]">
      <AboutHero />
      <AboutInterests />
    </div>
  );
}
