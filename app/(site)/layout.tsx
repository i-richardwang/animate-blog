import { SiteLayout } from '@/components/site-layout';

// The sections without a sidebar: about, blog, podcasts, projects, reading,
// status and token usage. One layout for all of them, so moving between them
// keeps the navbar, the footer and the layout's state still.
export default function Layout({ children }: LayoutProps<'/'>) {
  return <SiteLayout>{children}</SiteLayout>;
}
