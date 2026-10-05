import XIcon from '@/components/icons/x-icon';
import GithubIcon from '@/components/icons/github-icon';
import MailIcon from '@/components/icons/mail-icon';
import { SOCIAL } from '@/lib/site';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'GitHub', href: SOCIAL.github, Icon: GithubIcon, external: true },
  { label: 'X', href: SOCIAL.x, Icon: XIcon, external: true },
  { label: 'Email', href: `mailto:${SOCIAL.email}`, Icon: MailIcon },
];

// The icon links to GitHub, X and email shown in the navbars.
export function SocialLinks({ linkClassName }: { linkClassName: string }) {
  return LINKS.map(({ label, href, Icon, external }) => (
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
      <Icon />
    </a>
  ));
}
