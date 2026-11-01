import { LayoutDashboardIcon } from '@/components/animate-ui/icons/hugeicons/layout-dashboard';
import { AnimateIcon } from '@animate-ui/react/icons';

export const Projects = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <LayoutDashboardIcon animation="default-loop" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
