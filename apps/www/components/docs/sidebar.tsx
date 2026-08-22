'use client';

// The site sidebar, plugged into DocsLayout through `slots.sidebar.root` and
// built on the primitives from `fumadocs-ui/components/sidebar/*`. On desktop
// it is the notes' page tree with the site's borderless, animated look; on
// mobile it is a drawer that lists the site menu first and the page tree,
// when the section has one, below it.

import { cn } from '@workspace/ui/lib/utils';
import {
  SidebarContent,
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem as BaseSidebarItem,
  SidebarSeparator as BaseSidebarSeparator,
  SidebarViewport,
} from 'fumadocs-ui/components/sidebar/base';
import { createLinkItemRenderer } from 'fumadocs-ui/components/sidebar/link-item';
import { createPageTreeRenderer } from 'fumadocs-ui/components/sidebar/page-tree';
import type { SidebarProps } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import type { LinkItemType } from 'fumadocs-ui/layouts/shared';
import Link from 'fumadocs-core/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, SquareMenu } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { ThemeSwitcher } from '../animate/theme-switcher';
import { Separator } from '@/lib/attach-separator';
import { flatSections } from '@/lib/navigation';

const indicatorTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
} as const;

// A sidebar link with the site's vertical guide line and spring-animated
// active / hover indicators. Both the page tree and the link list use it.
function AnimatedItem({
  href,
  active,
  external,
  className,
  children,
  ...props
}: ComponentProps<typeof BaseSidebarItem>) {
  const [hovered, setHovered] = useState(false);

  return (
    <BaseSidebarItem
      href={href}
      external={external}
      active={active}
      className={cn(
        'relative flex items-center rounded-lg py-2 ml-2 pl-4 text-start',
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <span className="h-full w-px bg-border absolute left-[9px] inset-y-0" />

      <AnimatePresence initial={false} mode="wait">
        {active && (
          <motion.span
            layoutId="sidebar-item-active-indicator"
            className="pointer-events-none absolute z-11 left-[8px] top-1/2 h-[56%] w-[3px] -translate-y-1/2 rounded-full bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={indicatorTransition}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait">
        {hovered && (
          <motion.span
            layoutId="sidebar-item-hover-indicator"
            className="pointer-events-none absolute z-10 left-[8px] top-1/2 h-[56%] w-[3px] -translate-y-1/2 rounded-full dark:bg-neutral-600 bg-neutral-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={indicatorTransition}
          />
        )}
      </AnimatePresence>

      <motion.span
        className={cn(
          'text-sm w-full pl-[12px] text-neutral-700 dark:text-neutral-200',
          (active || hovered) && 'text-black dark:text-white',
        )}
        animate={{ x: hovered || active ? 3 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {children}
      </motion.span>
    </BaseSidebarItem>
  );
}

function SectionSeparator({
  className,
  ...props
}: ComponentProps<typeof BaseSidebarSeparator>) {
  return (
    <BaseSidebarSeparator
      className={cn(
        'inline-flex items-center gap-2 mb-2 mt-8 first:mt-4 px-2 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  );
}

const SidebarPageTree = createPageTreeRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem: BaseSidebarItem,
  SidebarSeparator: SectionSeparator,
});

const SidebarLinkItem = createLinkItemRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem: AnimatedItem,
});

function PageTreeItem({ item }: { item: PageTree.Item }) {
  const pathname = usePathname();
  return (
    <AnimatedItem
      href={item.url}
      external={item.external}
      active={pathname === item.url}
    >
      {item.name}
    </AnimatedItem>
  );
}

// Every folder in the notes tree is a root folder — its own section, with its
// own sidebar once you are inside it. So the folder is listed as a single link
// to its landing page; its pages are not spilled into the parent list.
function PageTreeFolder({ item }: { item: PageTree.Folder }) {
  const pathname = usePathname();
  if (!item.index) return null;
  return (
    <AnimatedItem
      href={item.index.url}
      external={item.index.external}
      active={pathname === item.index.url}
    >
      {item.name}
    </AnimatedItem>
  );
}

function PageTreeSeparator({ item }: { item: PageTree.Separator }) {
  return (
    <SectionSeparator>
      {item.icon}
      {item.name}
    </SectionSeparator>
  );
}

// The navbar's hover menus have no mobile equivalent, so the drawer lists
// sections and their sub-sections flat, in navbar order.
function SiteMenu() {
  const pathname = usePathname();
  return (
    <div className="my-4">
      <SectionSeparator className="mb-2 mt-0 pl-0">
        <Separator icon={<SquareMenu />} name="Menu" />
      </SectionSeparator>
      {flatSections.map((section) => (
        <AnimatedItem
          key={section.url}
          href={section.url}
          active={pathname === section.url}
        >
          {section.title}
        </AnimatedItem>
      ))}
    </div>
  );
}

function IconLinks({ items }: { items: LinkItemType[] }) {
  const icons = items.filter((item) => item.type === 'icon');
  if (icons.length === 0) return null;
  return (
    <div className="flex items-center justify-end">
      {icons.map((item, i, arr) => (
        <Link
          key={i}
          href={item.url}
          external={item.external}
          className={cn(
            buttonVariants({ size: 'icon', color: 'ghost' }),
            'text-fd-muted-foreground md:[&_svg]:size-4.5',
            i === arr.length - 1 && 'me-auto',
          )}
          aria-label={item.label}
        >
          {item.icon}
        </Link>
      ))}
      <ThemeSwitcher />
    </div>
  );
}

export function DocsSidebar({
  footer,
  banner,
  components,
  className,
  ...rest
}: SidebarProps) {
  const { menuItems } = useDocsLayout();
  const { full: tree } = useTreeContext();
  // Only sections that pass a page tree get a desktop sidebar.
  const hasPageTree = tree.children.length > 0;
  const links = menuItems.filter((item) => item.type !== 'icon');

  const pageTree = hasPageTree && (
    <>
      {links.length > 0 && (
        <SectionSeparator>
          <Separator
            icon={<BookOpen fill="currentColor" strokeWidth={2.5} />}
            name="指南"
          />
        </SectionSeparator>
      )}
      {links.map((item, i, list) => (
        <SidebarLinkItem
          key={i}
          item={item}
          className={cn(i === list.length - 1 && 'mb-4')}
        />
      ))}
      <SidebarPageTree
        Item={PageTreeItem}
        Folder={PageTreeFolder}
        Separator={PageTreeSeparator}
        {...components}
      />
    </>
  );
  const viewportProps = { className: 'md:pb-14 pb-4 max-md:pt-2 px-2' };

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
                className={cn(
                  'absolute flex flex-col w-full inset-s-0 inset-y-0 items-end bg-fd-background text-sm *:w-(--fd-sidebar-width)',
                  className,
                )}
                {...rest}
              >
                {banner}
                <SidebarViewport viewport={viewportProps}>
                  {pageTree}
                </SidebarViewport>
                {footer}
              </aside>
            </div>
          )}
        </SidebarContent>
      )}

      {/* Mobile: a drawer toggled from the navbar. */}
      <SidebarDrawerOverlay className="fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" />
      <SidebarDrawerContent className="fixed flex flex-col shadow-lg border-s inset-e-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out">
        {banner}
        <SidebarViewport viewport={viewportProps}>
          <SiteMenu />
          {pageTree}
        </SidebarViewport>
        <div className="flex flex-col border-t p-4 pt-2 empty:hidden">
          <IconLinks items={menuItems} />
          {footer}
        </div>
      </SidebarDrawerContent>
    </>
  );
}
