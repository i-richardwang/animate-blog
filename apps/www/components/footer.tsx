import Link from 'next/link';
import { MotionEffect } from './effects/motion-effect';

type FooterProps = {
  animated?: boolean;
};

export const Footer = ({ animated = false }: FooterProps) => {
  const content = (
    // Pages render this next to <DocsPage /> inside the docs layout grid,
    // whose template is three rows (header / toc-popover / main) and whose
    // outer columns size to their content. Pinning the footer to a fourth
    // row of the main column keeps it below the page without letting its
    // width pull the outer columns out of balance.
    <div className="w-full [grid-area:4/3/5/4]">
      <div className="mx-auto h-16 max-w-7xl">
        <div className="flex size-full items-center justify-center gap-4 px-4 text-sm text-muted-foreground md:px-6">
          <p className="truncate text-center">
            Built by{' '}
            <a
              href="https://x.com/richard2wang"
              rel="noopener noreferrer"
              target="_blank"
              className="underline hover:text-foreground"
            >
              Richard Wang
            </a>
            . Source on{' '}
            <a
              href="https://github.com/i-richardwang/animate-blog"
              rel="noopener noreferrer"
              target="_blank"
              className="underline hover:text-foreground"
            >
              GitHub
            </a>
            .
          </p>
          <Link
            href="/status"
            className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-foreground"
          >
            All operational
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping bg-success opacity-75" />
              <span className="relative inline-flex size-2 bg-success" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );

  if (animated) {
    return (
      <MotionEffect slide={{ direction: 'down' }} fade zoom delay={2.2}>
        {content}
      </MotionEffect>
    );
  }

  return content;
};
