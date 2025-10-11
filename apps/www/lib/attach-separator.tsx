import AnimateUIIcon from '@workspace/ui/components/icons/animateui-icon';
import BaseUIIcon from '@workspace/ui/components/icons/baseui-icon';
import CommunityIcon from '@workspace/ui/components/icons/community-icon';
import ImageIcon from '@workspace/ui/components/icons/image-icon';
import HeadlessUIIcon from '@workspace/ui/components/icons/headlessui-icon';
import RadixIcon from '@workspace/ui/components/icons/radix-icon';
import type { BuildPageTreeOptions } from 'fumadocs-core/source';
import {
  Code,
  RectangleHorizontalIcon,
  SparklesIcon,
  SquareMenu,
  TypeIcon,
  BookOpen,
  Wrench,
  TrendingUp,
  BarChart3,
  Calculator,
  Layout,
  Server,
  Rocket,
} from 'lucide-react';
import { LucideIcons } from '@/components/icons/lucide-icons';

const Icon = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative size-5 [&_svg]:size-[12px] flex items-center justify-center bg-border text-muted-foreground rounded-[5px]">
      {children}

      <span className="absolute left-1/2 translate-x-[calc(-50%-0.5px)] bg-border w-px h-[8px] top-full" />
    </span>
  );
};

export const Separator = ({
  icon,
  name,
}: {
  icon: React.ReactNode;
  name: string;
}) => {
  return (
    <span className="flex items-center gap-2">
      <Icon>{icon}</Icon>
      <span className="text-[13px] text-neutral-500">{name}</span>
    </span>
  );
};

export const attachSeparator: BuildPageTreeOptions['attachSeparator'] = (
  node,
) => {
  switch (node.name) {
    case 'Animate UI':
      node.name = (
        <Separator
          icon={<AnimateUIIcon className="!size-3" />}
          name="Animate UI"
        />
      );
      break;
    case 'Radix UI':
      node.name = (
        <Separator icon={<RadixIcon className="!size-2.5" />} name="Radix UI" />
      );
      break;
    case 'Base UI':
      node.name = <Separator icon={<BaseUIIcon />} name="Base UI" />;
      break;
    case 'Headless UI':
      node.name = <Separator icon={<HeadlessUIIcon />} name="Headless UI" />;
      break;
    case 'Effects':
      node.name = (
        <Separator icon={<SparklesIcon fill="currentColor" />} name="Effects" />
      );
      break;
    case 'Community':
      node.name = <Separator icon={<CommunityIcon />} name="Community" />;
      break;
    case 'Backgrounds':
      node.name = (
        <Separator icon={<ImageIcon strokeWidth={5} />} name="Backgrounds" />
      );
      break;
    case 'Buttons':
      node.name = (
        <Separator
          icon={<RectangleHorizontalIcon fill="currentColor" />}
          name="Buttons"
        />
      );
      break;
    case 'Texts':
      node.name = (
        <Separator icon={<TypeIcon strokeWidth={3} />} name="Texts" />
      );
      break;
    case 'Icons':
      node.name = (
        <Separator icon={<LucideIcons strokeWidth={2} />} name="Icons" />
      );
      break;
    case 'Usage':
      node.name = <Separator icon={<Code strokeWidth={3} />} name="Usage" />;
      break;
    case 'Guide':
      node.name = <Separator icon={<Code strokeWidth={2.5} />} name="Usage" />;
      break;
    case 'Menu':
      node.name = (
        <Separator icon={<SquareMenu strokeWidth={2} />} name="Menu" />
      );
      break;
    case 'Personal Notes':
      node.name = (
        <Separator icon={<Code strokeWidth={2.5} />} name="Personal Notes" />
      );
      break;
    case 'AI Exploration':
      node.name = (
        <Separator
          icon={<SparklesIcon fill="currentColor" />}
          name="AI Exploration"
        />
      );
      break;
    case 'Data Science':
      node.name = (
        <Separator icon={<BarChart3 strokeWidth={2} />} name="Data Science" />
      );
      break;
    case 'Development':
      node.name = (
        <Separator icon={<Code strokeWidth={2.5} />} name="Development" />
      );
      break;
    case 'Fundamentals':
      node.name = (
        <Separator icon={<BookOpen strokeWidth={2} />} name="Fundamentals" />
      );
      break;
    case 'Applications':
      node.name = (
        <Separator
          icon={<SparklesIcon fill="currentColor" />}
          name="Applications"
        />
      );
      break;
    case 'Tools':
      node.name = <Separator icon={<Wrench strokeWidth={2} />} name="Tools" />;
      break;
    case 'Analysis':
      node.name = (
        <Separator icon={<TrendingUp strokeWidth={2} />} name="Analysis" />
      );
      break;
    case 'Visualization':
      node.name = (
        <Separator icon={<BarChart3 strokeWidth={2} />} name="Visualization" />
      );
      break;
    case 'Statistics':
      node.name = (
        <Separator icon={<Calculator strokeWidth={2} />} name="Statistics" />
      );
      break;
    case 'Frontend':
      node.name = (
        <Separator icon={<Layout strokeWidth={2} />} name="Frontend" />
      );
      break;
    case 'Backend':
      node.name = (
        <Separator icon={<Server strokeWidth={2} />} name="Backend" />
      );
      break;
    case 'DevOps':
      node.name = <Separator icon={<Rocket strokeWidth={2} />} name="DevOps" />;
      break;
  }

  return node;
};
