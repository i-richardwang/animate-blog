import Link from 'next/link';
import { SITE, SOCIAL } from '@/lib/site';
import { cn } from '@/lib/utils';

export function FooterCredit({ className }: { className?: string }) {
  return (
    <p data-slot="footer-credit" className={className}>
      Built by{' '}
      <a
        href={SOCIAL.x}
        rel="noopener noreferrer"
        target="_blank"
        className="font-medium text-foreground underline decoration-2 underline-offset-4"
      >
        Richard Wang
      </a>
      . The source code is available on{' '}
      <a
        href={SITE.repo}
        rel="noopener noreferrer"
        target="_blank"
        className="font-medium text-foreground underline decoration-2 underline-offset-4"
      >
        GitHub
      </a>
      .
    </p>
  );
}

// A link to the status page with a pulsing green dot.
export function StatusLink({ className }: { className?: string }) {
  return (
    <Link
      href="/status"
      className={cn(
        'flex shrink-0 items-center gap-1.5 transition-colors hover:text-foreground',
        className,
      )}
    >
      All operational
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping motion-reduce:hidden bg-success opacity-75" />
        <span className="relative inline-flex size-2 bg-success" />
      </span>
    </Link>
  );
}

// The footer under every section's layout (see components/site-layout.tsx).
export function Footer() {
  return (
    <footer className="mx-auto flex h-16 w-full max-w-7xl items-center justify-center gap-4 px-4 text-sm text-muted-foreground md:px-6">
      <FooterCredit className="truncate text-center" />
      <StatusLink />
    </footer>
  );
}
