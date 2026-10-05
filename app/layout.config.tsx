import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

// Options shared by every section's layout (see components/site-layout.tsx).
export const baseOptions: BaseLayoutProps = {
  // The notes sidebar lists these above the page tree, under a "指南"
  // heading (see components/docs/sidebar.tsx).
  links: [
    {
      text: '欢迎',
      url: '/docs',
    },
  ],
};
