import {
  GithubIcon,
  Mail01Icon,
  NewTwitterIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { SOCIAL } from '@/lib/site';
import { cn } from '@/lib/utils';

const LINKS: {
  label: string;
  href: string;
  icon: IconSvgElement;
  external?: boolean;
}[] = [
  { label: 'GitHub', href: SOCIAL.github, icon: GithubIcon, external: true },
  { label: 'X', href: SOCIAL.x, icon: NewTwitterIcon, external: true },
  { label: 'Email', href: `mailto:${SOCIAL.email}`, icon: Mail01Icon },
];

// The icon links to GitHub, X and email shown in the navbars.
export function SocialLinks({ linkClassName }: { linkClassName: string }) {
  return LINKS.map(({ label, href, icon, external }) => (
    <a
      key={label}
      href={href}
      aria-label={label}
      {...(external && { target: '_blank', rel: 'noreferrer noopener' })}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-5 text-fd-muted-foreground',
        linkClassName,
      )}
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} />
    </a>
  ));
}
