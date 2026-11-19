import { DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { SectionPage } from '@/components/docs/page';
import { SiteBody } from '@/components/docs/site-body';
import { TokenUsageBoard } from '@/components/token-usage/token-usage-board';
import { sectionMetadata } from '@/lib/metadata';

const SECTION = {
  title: 'Token 用量',
  description: 'AI Token 使用量和成本的实时统计与趋势分析',
};

export const metadata = sectionMetadata({ ...SECTION, path: '/token-usage' });

export default function TokenUsagePage() {
  return (
    <SectionPage>
      <DocsTitle className="font-medium">{SECTION.title}</DocsTitle>
      <DocsDescription className="mb-1 font-normal">
        {SECTION.description}
      </DocsDescription>

      <SiteBody>
        <TokenUsageBoard />
      </SiteBody>
    </SectionPage>
  );
}
