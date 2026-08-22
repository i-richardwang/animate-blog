import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

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

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
