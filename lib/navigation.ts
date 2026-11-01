import {
  Activity01Icon,
  Analytics01Icon,
  Book02Icon,
  BookOpen02Icon,
  FolderLibraryIcon,
  PencilEdit02Icon,
  PodcastIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';

// The site's sections, declared once. The navbar, its hover menus and the
// mobile sidebar all render from this list rather than each keeping their own
// copy — which is how the navbar ended up with two 笔记 entries.
export interface NavSection {
  title: string;
  url: string;
  icon: IconSvgElement;
  // Sub-sections. A section with children opens as a menu in the navbar; the
  // section itself stays a link to its index page.
  children?: { title: string; url: string }[];
  // Kept here, rather than commented out, so the section is one flag away from
  // coming back and can't silently drift from the pages that exist.
  hidden?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: '博客',
    url: '/blog',
    icon: PencilEdit02Icon,
  },
  {
    title: '项目',
    url: '/projects',
    icon: FolderLibraryIcon,
  },
  {
    title: '笔记',
    url: '/docs',
    icon: Book02Icon,
    children: [
      { title: 'AI 探索', url: '/docs/ai' },
      { title: '数据科学', url: '/docs/data-science' },
      { title: '开发实践', url: '/docs/development' },
    ],
  },
  {
    title: 'Token 用量',
    url: '/token-usage',
    icon: Analytics01Icon,
  },
  {
    title: '系统状态',
    url: '/status',
    icon: Activity01Icon,
  },
  {
    title: '推荐阅读',
    url: '/reading',
    icon: BookOpen02Icon,
    hidden: true,
  },
  {
    title: '推荐播客',
    url: '/podcasts',
    icon: PodcastIcon,
    hidden: true,
  },
];

export const visibleSections = NAV_SECTIONS.filter((s) => !s.hidden);

// Section titles and urls in the order the mobile sidebar lists them: each
// section followed by its sub-sections.
export const flatSections = visibleSections.flatMap((section) => [
  { title: section.title, url: section.url },
  ...(section.children ?? []),
]);
