import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from 'fumadocs-ui/layouts/docs/slots/sidebar';
import type * as PageTree from 'fumadocs-core/page-tree';
import { baseOptions } from '@/app/layout.config';
import { Nav } from '@/components/docs/nav';
import { DocsSidebar } from '@/components/docs/sidebar';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';

// Every section of the site renders inside Fumadocs' DocsLayout so they share
// one navbar, one mobile drawer and one page grid. This builds the layout
// props for a section from its page tree.
//
// The site navbar is a fixed, full-width bar rather than the layout's own
// header. It is plugged in through the `header` slot and its height is
// published as `--fd-banner-height` (see globals.css), which is the variable
// the layout already uses to keep the sidebar and TOC below a fixed bar; the
// container gets the same amount of top padding so content starts below it.
export function siteLayoutProps(
  tree: PageTree.Root,
  options: Partial<DocsLayoutProps> = {},
): DocsLayoutProps {
  return {
    ...baseOptions,
    tree,
    githubUrl: 'https://github.com/i-richardwang/animate-blog',
    themeSwitch: {
      component: <ThemeSwitcher />,
    },
    slots: {
      header: Nav,
      sidebar: {
        provider: SidebarProvider,
        root: DocsSidebar,
        trigger: SidebarTrigger,
        useSidebar,
      },
    },
    containerProps: {
      className: 'pt-(--fd-banner-height)',
    },
    ...options,
  };
}
