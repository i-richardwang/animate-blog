import { AboutHero } from '@/components/about/hero';
import { AboutInterests } from '@/components/about/interests';

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
