// The site's sections, declared once: the navbar, its hover menus and the
// mobile drawer all render from this list.
export interface NavSection {
  title: string;
  url: string;
  // Sub-sections. A section with children opens as a menu in the navbar; the
  // section itself stays a link to its index page.
  children?: { title: string; url: string }[];
  // A section whose pages are built but not linked from the navigation.
  hidden?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: '博客',
    url: '/blog',
  },
  {
    title: '项目',
    url: '/projects',
  },
  {
    title: '笔记',
    url: '/docs',
    children: [
      { title: 'AI 探索', url: '/docs/ai' },
      { title: '数据科学', url: '/docs/data-science' },
      { title: '开发实践', url: '/docs/development' },
    ],
  },
  {
    title: 'Token 用量',
    url: '/token-usage',
  },
  {
    title: '系统状态',
    url: '/status',
  },
  {
    title: '推荐阅读',
    url: '/reading',
    hidden: true,
  },
  {
    title: '推荐播客',
    url: '/podcasts',
    hidden: true,
  },
];

export const visibleSections = NAV_SECTIONS.filter((s) => !s.hidden);

// Section titles and urls in the order the mobile sidebar lists them: each
// section followed by its sub-sections.
export const flatSections = visibleSections.flatMap((section) => [
  { title: section.title, url: section.url, depth: 0 },
  ...(section.children ?? []).map((child) => ({ ...child, depth: 1 })),
]);
