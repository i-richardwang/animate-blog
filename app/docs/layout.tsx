import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';
import { source } from '@/lib/source';

export default function NotesLayout({ children }: { children: ReactNode }) {
  return <SiteLayout tree={source.pageTree}>{children}</SiteLayout>;
}
