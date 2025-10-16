import ReactIcon from '@workspace/ui/components/icons/react-icon';
import TSIcon from '@workspace/ui/components/icons/ts-icon';
import TailwindIcon from '@workspace/ui/components/icons/tailwind-icon';
import MotionIcon from '@workspace/ui/components/icons/motion-icon';
import ShadcnIcon from '@workspace/ui/components/icons/shadcn-icon';
import PythonIcon from '@workspace/ui/components/icons/python-icon';
import NextjsIcon from '@workspace/ui/components/icons/nextjs-icon';
import FastapiIcon from '@workspace/ui/components/icons/fastapi-icon';
import StreamlitIcon from '@workspace/ui/components/icons/streamlit-icon';
import LangchainIcon from '@workspace/ui/components/icons/langchain-icon';
import McpIcon from '@workspace/ui/components/icons/mcp-icon';
import { cn } from '@workspace/ui/lib/utils';

interface TechStackIconsProps {
  tech: string[];
  className?: string;
  maxDisplay?: number;
}

const TECH_ICON_MAP: Record<string, React.ComponentType<any>> = {
  React: ReactIcon,
  TypeScript: TSIcon,
  'Tailwind CSS': TailwindIcon,
  Motion: MotionIcon,
  Fumadocs: ShadcnIcon,
  'Next.js': NextjsIcon,
  Python: PythonIcon,
  FastAPI: FastapiIcon,
  Streamlit: StreamlitIcon,
  LangChain: LangchainIcon,
  MCP: McpIcon,
};

export function TechStackIcons({
  tech,
  className,
  maxDisplay = 5,
}: TechStackIconsProps) {
  const displayedTech = tech.slice(0, maxDisplay);
  const remaining = tech.length - maxDisplay;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {displayedTech.map((techName) => {
        const Icon = TECH_ICON_MAP[techName];
        if (!Icon) return null;

        return (
          <div
            key={techName}
            className="flex-shrink-0 size-5 text-muted-foreground"
            title={techName}
          >
            <Icon className="size-full" />
          </div>
        );
      })}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}
