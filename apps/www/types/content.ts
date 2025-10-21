/**
 * Shared types for content (blogs and docs)
 */

export type LatestContent = {
  title: string;
  url: string;
  date: Date;
  type: 'blog' | 'docs';
};
