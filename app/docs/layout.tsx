import { SiteLayout } from '@/components/site-layout';
import { source } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return <SiteLayout tree={source.pageTree}>{children}</SiteLayout>;
}
