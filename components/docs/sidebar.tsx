'use client';

// The site sidebar, plugged into DocsLayout through `slots.sidebar.root` and
// built on the primitives from `fumadocs-ui/components/sidebar/*`. On desktop
// it is the notes' page tree with the site's borderless, animated look; on
// mobile it is a drawer that lists the site menu first and the page tree,
// when the section has one, below it.

import { cn } from '@/lib/utils';
import {
  SidebarContent,
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
} from 'fumadocs-ui/components/sidebar/base';
import { createLinkItemRenderer } from 'fumadocs-ui/components/sidebar/link-item';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useScrollFade } from '@animate-ui/react/primitives/effects/scroll-fade';
import { usePathname } from 'next/navigation';
import { BookOpen02Icon, Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRef, type ComponentProps, type ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SocialLinks } from '@/components/social-links';
import { flatSections } from '@/lib/navigation';
import {
  AnimatedNav,
  NavItemContent,
  NavSectionTitle,
  useNavHover,
} from './animated-nav';

// A sidebar link with the site's navigation look (see animated-nav.tsx).
// Both the page tree and the link list use it.
function AnimatedItem({
  href,
  active,
  external,
  depth,
  className,
  children,
  ...props
}: ComponentProps<typeof SidebarItem> & { depth?: number }) {
  const { hovered, hoverProps } = useNavHover(String(href));

  return (
    <SidebarItem
      href={href}
      external={external}
      active={active}
      className={cn(
        'relative flex items-center rounded-lg py-1.5 ml-2 pl-4 text-start font-medium',
        className,
      )}
      {...hoverProps}
      {...props}
    >
      <NavItemContent active={Boolean(active)} hovered={hovered} depth={depth}>
        {children}
      </NavItemContent>
    </SidebarItem>
  );
}

// The heading of a group of links. Every group in the sidebar and the
// drawer starts with one, and only headings space the groups apart: 24px
// above each but the first, as on Animate UI's docs.
function SectionSeparator({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SidebarSeparator className="mt-6 mb-2 px-2 first:mt-0">
      <NavSectionTitle icon={icon}>{children}</NavSectionTitle>
    </SidebarSeparator>
  );
}

const SidebarLinkItem = createLinkItemRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem: AnimatedItem,
});

// The current section's page tree. Every folder in the notes tree is a root
// folder, a section with its own sidebar once you are inside it, so here it
// is a single link to its landing page and the list stays flat. Separators
// come from meta.json (`---[Icon]Name---`), their icon resolved by the
// loader (see lib/source.ts).
function PageTreeList() {
  const { root } = useTreeContext();
  const pathname = usePathname();
  const link = (key: string, item: PageTree.Item, name: ReactNode) => (
    <AnimatedItem
      key={key}
      href={item.url}
      external={item.external}
      active={pathname === item.url}
    >
      {name}
    </AnimatedItem>
  );

  return root.children.map((node, i) => {
    const key = node.$id ?? String(i);
    switch (node.type) {
      case 'page':
        return link(key, node, node.name);
      case 'folder':
        return node.index ? link(key, node.index, node.name) : null;
      case 'separator':
        return (
          <SectionSeparator key={key} icon={node.icon}>
            {node.name}
          </SectionSeparator>
        );
    }
  });
}

// The scrolling part of the sidebar and of the drawer: no scrollbar, the
// content fading out at the edges instead (the TOC scrolls the same way).
// Its content starts at --sidebar-inset (see globals.css), the inset the
// navbar's row shares, and 24px down, the gap the page keeps under the
// navbar. The right inset stays small: note titles run to 14 Chinese
// characters and should not wrap.
function SidebarScroll({ children }: { children: ReactNode }) {
  const scroll = useRef<HTMLDivElement>(null);
  useScrollFade(scroll, { size: 24, blur: 0 });
  return (
    <div
      ref={scroll}
      data-slot="sidebar-scroll"
      className="min-h-0 flex-1 overflow-y-auto overscroll-none ps-(--sidebar-inset) pe-2 pt-6 pb-4 [scrollbar-width:none] md:pb-14"
    >
      {children}
    </div>
  );
}

// The navbar's hover menus have no mobile equivalent, so the drawer lists
// the sections in navbar order, each one's sub-sections indented under it.
function SiteMenu() {
  const pathname = usePathname();
  return (
    <>
      <SectionSeparator
        icon={<HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />}
      >
        Menu
      </SectionSeparator>
      {flatSections.map((section) => (
        <AnimatedItem
          key={section.url}
          href={section.url}
          active={pathname === section.url}
          depth={section.depth}
        >
          {section.title}
        </AnimatedItem>
      ))}
    </>
  );
}

// Rendered through DocsLayout's sidebar slot. The site sets no sidebar
// options, so the slot passes no props.
export function DocsSidebar() {
  // The baseOptions links (see app/layout.config.tsx), listed under 指南.
  // The site passes no icon links, but the type allows them.
  const links = useDocsLayout().menuItems.filter(
    (item) => item.type !== 'icon',
  );
  const { full: tree } = useTreeContext();
  // Only sections that pass a page tree get a desktop sidebar.
  const hasPageTree = tree.children.length > 0;

  const pageTree = hasPageTree && (
    <>
      {links.length > 0 && (
        <SectionSeparator
          icon={<HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />}
        >
          指南
        </SectionSeparator>
      )}
      {links.map((item, i) => (
        <SidebarLinkItem key={i} item={item} />
      ))}
      <PageTreeList />
    </>
  );
  return (
    <>
      {/* Desktop: a sticky column in the layout grid. */}
      {hasPageTree && (
        <SidebarContent>
          {({ ref, onPointerEnter, onPointerLeave }) => (
            <div
              data-sidebar-placeholder=""
              className="sticky top-(--fd-docs-row-1) z-20 [grid-area:sidebar] h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] md:layout:[--fd-sidebar-width:268px] lg:layout:[--fd-sidebar-width:286px] max-md:hidden"
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
            >
              <aside
                id="nd-sidebar"
                ref={ref}
                className="absolute flex flex-col w-full inset-s-0 inset-y-0 items-end bg-fd-background text-sm *:w-(--fd-sidebar-width)"
              >
                <SidebarScroll>
                  <AnimatedNav>{pageTree}</AnimatedNav>
                </SidebarScroll>
              </aside>
            </div>
          )}
        </SidebarContent>
      )}

      {/* Mobile: a drawer toggled from the navbar. */}
      <SidebarDrawerOverlay className="fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" />
      <SidebarDrawerContent className="fixed flex flex-col shadow-lg border-s inset-e-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out">
        <SidebarScroll>
          <AnimatedNav>
            <SiteMenu />
            {pageTree}
          </AnimatedNav>
        </SidebarScroll>
        {/* The navbar's links and theme toggle, which the drawer replaces on
            a phone, centred in a bar as on Animate UI's docs. */}
        <div className="flex items-center justify-between border-t p-3">
          <div className="flex items-center gap-1">
            <SocialLinks linkClassName="size-8" />
          </div>
          <ThemeToggle />
        </div>
      </SidebarDrawerContent>
    </>
  );
}
