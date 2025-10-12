import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { Nav } from '@/components/docs/nav';
import { baseOptions } from '@/app/layout.config';
import { ThemeSwitcher } from '@/components/animate/theme-switcher';
import XIcon from '@workspace/ui/components/icons/x-icon';
import { getSortedProjects } from '@/lib/source';
import type { PageTree } from 'fumadocs-core/server';

const projectTree: PageTree.Root = {
  name: 'Projects',
  children: getSortedProjects().map((project) => ({
    type: 'page',
    name: project.data.title,
    url: project.url,
  })),
};

const PROJECTS_LAYOUT_PROPS: DocsLayoutProps = {
  tree: projectTree,
  githubUrl: 'https://github.com/i-richardwang/animate-blog',
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
  links: [
    ...(baseOptions.links || []),
    {
      icon: <XIcon />,
      url: 'https://x.com/richard2wang',
      text: 'X',
      type: 'icon',
    },
  ],
  sidebar: {
    enabled: false,
  },
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...PROJECTS_LAYOUT_PROPS}
      nav={{
        component: <Nav />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
