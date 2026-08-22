import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export default function UreadingLayout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
