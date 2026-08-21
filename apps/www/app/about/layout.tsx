import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { siteLayoutProps } from '@/lib/site-layout';
import { ScrollProgressBar } from '@/components/scroll-progress-bar';

export const metadata: Metadata = {
  title: 'About Me',
  description:
    'Learning, Building, Sharing. 科幻爱好者、摄影器材党、Self-Hosted 实践者、音乐发烧友、电影爱好者。',
  openGraph: {
    title: 'About Me - Richard Wang',
    description:
      'Learning, Building, Sharing. 科幻爱好者、摄影器材党、Self-Hosted 实践者、音乐发烧友、电影爱好者。',
    type: 'profile',
  },
};

const ABOUT_LAYOUT_PROPS = siteLayoutProps({
  name: 'About',
  children: [],
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <DocsLayout {...ABOUT_LAYOUT_PROPS}>{children}</DocsLayout>
    </>
  );
}
