import { BadgeCheckIcon } from '@/registry/icons/badge-check';
import { AnimateIcon } from '@/registry/icons/icon';

export const Reading = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <BadgeCheckIcon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
