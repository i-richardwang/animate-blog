import { ChartColumnIncreasingIcon } from '@/components/animate-ui/icons/chart-column-increasing';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';

export const TokenUsage = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <ChartColumnIncreasingIcon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
