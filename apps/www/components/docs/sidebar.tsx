'use client';

// The docs sidebar, built on the sidebar primitives Fumadocs 16 exports from
// `fumadocs-ui/components/sidebar/*`. It replaces the stock sidebar slot
// (`slots.sidebar.root`) and keeps this site's look: a borderless list with an
// animated active/hover indicator, plus a mobile drawer that doubles as the
// site menu on routes that have no page tree of their own.

import { cn } from '@workspace/ui/lib/utils';
import { useIsMobile } from '@workspace/ui/hooks/use-mobile';
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
import type { LinkItemType } from 'fumadocs-ui/layouts/shared';
import Link from 'fumadocs-core/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { SquareMenu } from 'lucide-react';
import { type ComponentProps, type ReactNode, useState } from 'react';
import { ThemeSwitcher } from '../animate/theme-switcher';
import { Separator } from '@/lib/attach-separator';
import { docsSectionUrls, flatSections } from '@/lib/navigation';

// Routes whose layout uses this sidebar but has no page tree to show. This is
// a layout concern, not a navigation one, so it stays a list of its own rather
// than being derived from the nav manifest.
const CONTENT_SECTIONS = [
  '/blog',
  '/projects',
  '/reading',
  '/podcasts',
  '/token-usage',
  '/status',
  '/about',
] as const;

const isContentSection = (pathname: string) =>
  CONTENT_SECTIONS.some((section) => pathname.startsWith(section));

const isDocsSection = (pathname: string) =>
  docsSectionUrls.some((section) => pathname.startsWith(section));

// The navbar's hover menus have no mobile equivalent, so sections and their
// sub-sections are listed flat here, in navbar order.
const MENU_ITEMS: { name: ReactNode; url?: string; icon?: ReactNode }[] = [
  { name: 'Menu', icon: <SquareMenu /> },
  ...flatSections.map((section) => ({
    name: section.title,
    url: section.url,
  })),
];

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
}: Omit<ComponentProps<typeof BaseSidebarItem>, 'children'> & {
  active: boolean;
  children: ReactNode;
}) {
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
  SidebarItem: AnimatedItem as typeof BaseSidebarItem,
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

// Folders are shown flat: a link to the folder's index page (when it has
// one) followed by its children. The notes tree is organised by separators
// rather than nested folders, so this keeps the list one level deep.
function PageTreeFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      {item.index && (
        <AnimatedItem
          href={item.index.url}
          external={item.index.external}
          active={pathname === item.index.url}
        >
          {item.name}
        </AnimatedItem>
      )}
      {children}
    </>
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

function MenuList() {
  const pathname = usePathname();
  return (
    <div className="mt-4 mb-4">
      {MENU_ITEMS.map((item, i) =>
        item.url ? (
          <AnimatedItem key={i} href={item.url} active={pathname === item.url}>
            {item.name}
          </AnimatedItem>
        ) : (
          <SectionSeparator key={i} className="mb-2 mt-0 pl-0">
            <Separator icon={item.icon} name={item.name as string} />
          </SectionSeparator>
        ),
      )}
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
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isContentPage = isContentSection(pathname);
  const showMobileMenu = isContentPage || isDocsSection(pathname);
  const links = menuItems.filter((item) => item.type !== 'icon');

  const viewport = (
    <SidebarViewport
      viewport={{
        className: 'md:pb-14 pb-4 max-md:pt-2 px-2',
      }}
    >
      {!isContentPage &&
        links.map((item, i, list) => (
          <SidebarLinkItem
            key={i}
            item={item}
            className={cn(i === list.length - 1 && 'mb-4')}
          />
        ))}

      {showMobileMenu && isMobile && <MenuList />}

      {!isContentPage && (
        <SidebarPageTree
          Item={PageTreeItem}
          Folder={PageTreeFolder}
          Separator={PageTreeSeparator}
          {...components}
        />
      )}
    </SidebarViewport>
  );

  return (
    <>
      {/* Desktop: a sticky column in the layout grid. Hidden on content
          sections, which then also get no sidebar column. */}
      {!isContentPage && (
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
                ref={ref as React.Ref<HTMLElement>}
                className={cn(
                  'absolute flex flex-col w-full inset-s-0 inset-y-0 items-end bg-fd-background text-sm *:w-(--fd-sidebar-width)',
                  className,
                )}
                {...rest}
              >
                {banner}
                {viewport}
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
        {viewport}
        <div className="flex flex-col border-t p-4 pt-2 empty:hidden">
          <IconLinks items={menuItems} />
          {footer}
        </div>
      </SidebarDrawerContent>
    </>
  );
}
