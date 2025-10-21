import { UsersIcon } from '@/registry/icons/users';
import { AnimateIcon } from '@/registry/icons/icon';

export const About = () => {
  return (
    <AnimateIcon asChild animateOnHover>
      <div className="w-full flex justify-center items-center h-full aspect-[350/190] dark:text-neutral-500 text-neutral-400">
        <UsersIcon animation="default" className="size-20" />
      </div>
    </AnimateIcon>
  );
};
