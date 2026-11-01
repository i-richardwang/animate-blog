import { Attachment01Icon } from '@/components/animate-ui/icons/hugeicons/attachment-01';
import { AnimateIcon } from '@animate-ui/react/icons';

export const Notes = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <Attachment01Icon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
