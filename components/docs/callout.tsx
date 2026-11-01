import { Alert02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ReactNode } from 'react';

const iconClass = '-me-0.5 size-5 shrink-0 text-(--callout-color)';

const VARIANTS = {
  info: {
    color: 'var(--color-fd-info)',
    icon: (
      <HugeiconsIcon
        icon={InformationCircleIcon}
        strokeWidth={2}
        className={iconClass}
      />
    ),
  },
  warn: {
    color: 'var(--color-fd-warning)',
    icon: (
      <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className={iconClass} />
    ),
  },
};

export function Callout({
  type = 'info',
  children,
}: {
  type?: keyof typeof VARIANTS;
  children: ReactNode;
}) {
  const variant = VARIANTS[type];
  return (
    <div
      className="flex gap-2 my-4 rounded-lg bg-fd-accent/50 p-3 ps-2 text-sm text-fd-card-foreground"
      style={{ '--callout-color': variant.color } as object}
    >
      <div role="none" className="w-0.5 bg-(--callout-color)/50 rounded-sm" />
      {variant.icon}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="text-fd-muted-foreground prose-no-margin empty:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
