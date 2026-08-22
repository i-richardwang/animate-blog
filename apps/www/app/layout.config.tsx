import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  // The notes sidebar lists these above the page tree, under a "指南"
  // heading (see components/docs/sidebar.tsx).
  links: [
    {
      text: '欢迎',
      url: '/docs',
      secondary: false,
    },
  ],
};
