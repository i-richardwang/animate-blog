import ReactIcon from '@/components/icons/react-icon';
import TSIcon from '@/components/icons/ts-icon';
import TailwindIcon from '@/components/icons/tailwind-icon';
import MotionIcon from '@/components/icons/motion-icon';
import PythonIcon from '@/components/icons/python-icon';
import NextjsIcon from '@/components/icons/nextjs-icon';
import FastapiIcon from '@/components/icons/fastapi-icon';
import StreamlitIcon from '@/components/icons/streamlit-icon';
import LangchainIcon from '@/components/icons/langchain-icon';
import McpIcon from '@/components/icons/mcp-icon';
import SklearnIcon from '@/components/icons/sklearn-icon';
import PlotlyIcon from '@/components/icons/plotly-icon';
import MilvusIcon from '@/components/icons/milvus-icon';
import PandasIcon from '@/components/icons/pandas-icon';
import NodejsIcon from '@/components/icons/nodejs-icon';

interface TechStackIconsProps {
  tech: string[];
  maxDisplay?: number;
}

const TECH_ICON_MAP: Record<string, React.ComponentType<any>> = {
  React: ReactIcon,
  TypeScript: TSIcon,
  'Tailwind CSS': TailwindIcon,
  Motion: MotionIcon,
  'Next.js': NextjsIcon,
  Python: PythonIcon,
  FastAPI: FastapiIcon,
  Streamlit: StreamlitIcon,
  LangChain: LangchainIcon,
  MCP: McpIcon,
  'scikit-learn': SklearnIcon,
  Plotly: PlotlyIcon,
  Milvus: MilvusIcon,
  pandas: PandasIcon,
  'Node.js': NodejsIcon,
};

export function TechStackIcons({
  tech,
  maxDisplay = 5,
}: TechStackIconsProps) {
  const displayedTech = tech.slice(0, maxDisplay);
  const remaining = tech.length - maxDisplay;

  return (
    <div className="flex items-center gap-2">
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
