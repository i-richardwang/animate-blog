import { MessageSquareQuoteIcon } from '@/components/animate-ui/icons/message-square-quote';
import { AnimateIcon } from '@animate-ui/react/icons';

export const Blog = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <MessageSquareQuoteIcon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
