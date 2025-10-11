import { PaperclipIcon } from '@/registry/icons/paperclip';
import { AnimateIcon } from '@/registry/icons/icon';

export const Notes = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/259.17] dark:text-neutral-500 text-neutral-400">
        <PaperclipIcon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
