import { cn } from '@/lib/utils';

// The look of a link that is a page's main way onward, such as the home
// page's calls to action or the 404 page's way back: `primary` for the first
// choice, `secondary` for the rest.
export const actionLinkClassName = (variant: 'primary' | 'secondary') =>
  cn(
    'inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors [&_svg]:size-4',
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/85'
      : 'bg-accent hover:bg-accent/70',
  );
