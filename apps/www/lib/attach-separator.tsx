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
  Rocket,
  Database,
  Cpu,
  Lightbulb,
  HardDrive,
  Hammer,
  PieChart,
  LineChart,
  Zap,
  FlaskConical,
} from 'lucide-react';
import { LucideIcons } from '@/components/icons/lucide-icons';

const IconWrapper = ({ children }: { children: React.ReactNode }) => {
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
      <IconWrapper>{icon}</IconWrapper>
      <span className="text-[13px] text-neutral-500">{name}</span>
    </span>
  );
};

const SeparatorIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <IconWrapper>{children}</IconWrapper>
  );
};

// Map separator names to their icons
const separatorIcons: Record<string, React.ReactNode> = {
  'Animate UI': <SeparatorIcon><AnimateUIIcon className="!size-3" /></SeparatorIcon>,
  'Radix UI': <SeparatorIcon><RadixIcon className="!size-2.5" /></SeparatorIcon>,
  'Base UI': <SeparatorIcon><BaseUIIcon /></SeparatorIcon>,
  'Headless UI': <SeparatorIcon><HeadlessUIIcon /></SeparatorIcon>,
  'Effects': <SeparatorIcon><SparklesIcon fill="currentColor" /></SeparatorIcon>,
  'Community': <SeparatorIcon><CommunityIcon /></SeparatorIcon>,
  'Backgrounds': <SeparatorIcon><ImageIcon strokeWidth={5} /></SeparatorIcon>,
  'Buttons': <SeparatorIcon><RectangleHorizontalIcon fill="currentColor" /></SeparatorIcon>,
  'Texts': <SeparatorIcon><TypeIcon strokeWidth={3} /></SeparatorIcon>,
  'Icons': <SeparatorIcon><LucideIcons strokeWidth={2} /></SeparatorIcon>,
  'Usage': <SeparatorIcon><Code strokeWidth={3} /></SeparatorIcon>,
  'Guide': <SeparatorIcon><Code strokeWidth={2.5} /></SeparatorIcon>,
  'Menu': <SeparatorIcon><SquareMenu strokeWidth={2} /></SeparatorIcon>,
  '技术解码': <SeparatorIcon><Zap strokeWidth={2} /></SeparatorIcon>,
  '深度实践': <SeparatorIcon><Cpu strokeWidth={2} /></SeparatorIcon>,
  '原型实验': <SeparatorIcon><FlaskConical strokeWidth={2} /></SeparatorIcon>,
  '数据集构造': <SeparatorIcon><Database strokeWidth={2} /></SeparatorIcon>,
  '员工流失预测项目实战': <SeparatorIcon><Rocket strokeWidth={2} /></SeparatorIcon>,
  'Self Hosted': <SeparatorIcon><HardDrive strokeWidth={2} /></SeparatorIcon>,
  '进阶图表绘制': <SeparatorIcon><LineChart strokeWidth={2} /></SeparatorIcon>,
  'Tableau 仪表板': <SeparatorIcon><PieChart strokeWidth={2} /></SeparatorIcon>,
  '独立开发': <SeparatorIcon><Hammer strokeWidth={2} /></SeparatorIcon>,
  '优化策略': <SeparatorIcon><Lightbulb strokeWidth={2} /></SeparatorIcon>,
};

export const attachSeparator: BuildPageTreeOptions['attachSeparator'] = (
  node,
) => {
  const name = node.name as string;
  const icon = separatorIcons[name];
  
  if (icon) {
    // Set icon separately, keep name as plain text
    // This way sidebar shows icon + name, but breadcrumb only shows name
    node.icon = icon as React.ReactElement;
    // node.name stays as the original string
  }

  return node;
};
