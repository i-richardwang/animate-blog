import { DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { SectionPage } from '@/components/docs/page';
import { SiteBody } from '@/components/docs/site-body';
import { StatusBoard } from '@/components/status/status-board';
import { sectionMetadata } from '@/lib/metadata';

const SECTION = {
  title: '系统状态',
  description: '所有服务的实时状态和运行时间信息',
};

export const metadata = sectionMetadata({ ...SECTION, path: '/status' });

export default function StatusPage() {
  return (
    <SectionPage>
      <DocsTitle className="font-medium">{SECTION.title}</DocsTitle>
      <DocsDescription className="mb-1 font-normal">
        {SECTION.description}
      </DocsDescription>

      <SiteBody>
        <StatusBoard />
      </SiteBody>
    </SectionPage>
  );
}
