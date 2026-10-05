import { ExternalLink } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Shine } from '@/components/animate-ui/primitives/effects/shine';
import { cn } from '@/lib/utils';

// The primary call to action on reading and podcast pages: open the
// original article or episode.
export function ExternalLinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Shine enableOnHover duration={1200} asChild>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          buttonVariants({
            color: 'ghost',
            size: 'sm',
            className:
              'gap-2 [&_svg]:size-3.5 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:text-primary-foreground border-0',
          }),
        )}
      >
        <ExternalLink />
        {children}
      </a>
    </Shine>
  );
}
