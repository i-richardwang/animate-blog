import type { LoaderPlugin } from 'fumadocs-core/source';
import {
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

// Map separator names to their icons
const separatorIcons: Record<string, React.ReactNode> = {
  '技术解码': <IconWrapper><Zap strokeWidth={2} /></IconWrapper>,
  '深度实践': <IconWrapper><Cpu strokeWidth={2} /></IconWrapper>,
  '原型实验': <IconWrapper><FlaskConical strokeWidth={2} /></IconWrapper>,
  '数据集构造': <IconWrapper><Database strokeWidth={2} /></IconWrapper>,
  '员工流失预测项目实战': <IconWrapper><Rocket strokeWidth={2} /></IconWrapper>,
  'Self Hosted': <IconWrapper><HardDrive strokeWidth={2} /></IconWrapper>,
  '进阶图表绘制': <IconWrapper><LineChart strokeWidth={2} /></IconWrapper>,
  'Tableau 仪表板': <IconWrapper><PieChart strokeWidth={2} /></IconWrapper>,
  '独立开发': <IconWrapper><Hammer strokeWidth={2} /></IconWrapper>,
  '优化策略': <IconWrapper><Lightbulb strokeWidth={2} /></IconWrapper>,
};

// Gives section separators an icon.
export const attachSeparator: LoaderPlugin = {
  name: 'attach-separator',
  transformPageTree: {
    separator(node) {
      const icon = separatorIcons[node.name as string];
      // Set icon separately and keep the name as plain text, so the sidebar
      // shows icon + name while the breadcrumb only shows the name.
      if (icon) node.icon = icon as React.ReactElement;
      return node;
    },
  },
};
