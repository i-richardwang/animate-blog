import { ClapperboardIcon } from '@/registry/icons/clapperboard';
import { AnimateIcon } from '@/registry/icons/icon';

export const Films = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <ClapperboardIcon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
