import { MessageSquareQuoteIcon } from '@/registry/icons/message-square-quote';
import { AnimateIcon } from '@/registry/icons/icon';

export const Blog = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/210] dark:text-neutral-500 text-neutral-400">
        <MessageSquareQuoteIcon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
