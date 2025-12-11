import { LayersIcon } from '@/registry/icons/layers';
import { AnimateIcon } from '@/registry/icons/icon';

export const Books = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <LayersIcon animation="default-loop" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
