import { AudioLinesIcon } from '@/registry/icons/audio-lines';
import { AnimateIcon } from '@/registry/icons/icon';

export const Podcasts = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <AudioLinesIcon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
