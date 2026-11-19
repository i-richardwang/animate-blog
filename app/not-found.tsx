import type { Metadata } from 'next';
import Link from 'next/link';
import { DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { SiteLayout } from '@/components/site-layout';
import { SitePage } from '@/components/docs/page';
import { SiteBody } from '@/components/docs/site-body';
import { visibleSections } from '@/lib/navigation';

export const metadata: Metadata = { title: '页面不存在' };

// Unmatched URLs and notFound() calls both land here: a section page in the
// site's own layout, rather than Next's unthemed default, with the way back
// to every section.
export default function NotFound() {
  return (
    <SiteLayout>
      <SitePage tableOfContent={{ enabled: false }} className="max-w-[1124px]">
        <DocsTitle className="font-medium">页面不存在</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          链接可能已经失效，或者页面换了地址。
        </DocsDescription>

        <SiteBody>
          <nav className="not-prose flex flex-wrap gap-3">
            {[{ title: '首页', url: '/' }, ...visibleSections].map(
              (section, i) => (
                <Link
                  key={section.url}
                  href={section.url}
                  className={
                    i === 0
                      ? 'inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85'
                      : 'inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-medium transition-colors hover:bg-accent/70'
                  }
                >
                  {section.title}
                </Link>
              ),
            )}
          </nav>
        </SiteBody>
      </SitePage>
    </SiteLayout>
  );
}
