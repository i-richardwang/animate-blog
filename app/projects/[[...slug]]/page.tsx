import { projects, getNeighbours, getOrderedProjects } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { ProjectList } from '@/components/docs/project-list';
import { ProjectActions } from '@/components/docs/page-actions';
import { PageTitle } from '@/components/docs/page-title';
import { pageMetadata, sectionMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/site';

const SECTION = { title: '项目', description: '探索技术，构建产品' };

// The portfolio leads the page; the other categories are grouped under
// "实验室".
const LAB_GROUPS = [
  { category: 'business', title: '业务实践' },
  { category: 'exploration', title: '学习探索' },
  { category: 'personal', title: '个人空间' },
] as const;

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const ordered = getOrderedProjects();
    const inCategory = (category: string) =>
      ordered
        .filter((project) => project.data.category === category)
        .map((project) => ({
          url: project.url,
          title: project.data.title,
          description: project.data.description,
          tech: project.data.tech,
          logo: project.data.logo,
        }));
    const portfolio = inCategory('portfolio');
    const labGroups = LAB_GROUPS.map((group) => ({
      ...group,
      projects: inCategory(group.category),
    })).filter((group) => group.projects.length > 0);

    return (
      <DocsPage tableOfContent={{ enabled: false }} className="!max-w-[1124px]">
        <DocsTitle className="font-medium">{SECTION.title}</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          {SECTION.description}
        </DocsDescription>

        <DocsBody id="docs-body" className="pb-10 pt-4">
          {portfolio.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-foreground">
                作品集
              </h2>
              <ProjectList projects={portfolio} />
            </section>
          )}

          <div className="mt-4 mb-8 border-t border-border" />

          <h2 className="text-2xl font-medium mb-8 text-foreground">实验室</h2>

          {labGroups.map((group) => (
            <section key={group.category} className="mb-12 last:mb-0">
              <h3 className="text-lg font-medium mb-6 text-muted-foreground">
                {group.title}
              </h3>
              <ProjectList projects={group.projects} />
            </section>
          ))}
        </DocsBody>
      </DocsPage>
    );
  }

  const page = projects.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const { previous, next } = getNeighbours(getOrderedProjects(), page.url);

  return (
    <DocsPage
      tableOfContent={{ enabled: false }}
      className="!max-w-[860px]"
      footer={{ items: { previous, next } }}
    >
      <PageTitle
        title={page.data.title}
        url={page.url}
        previous={previous}
        next={next}
        emptyLabels={{ previous: '没有上一个项目', next: '没有下一个项目' }}
      />
      <DocsDescription className="mb-1 font-normal">
        {page.data.description}
      </DocsDescription>

      {page.data.tech.length > 0 && (
        <div className="flex flex-row gap-2 items-center flex-wrap">
          {page.data.tech.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-row gap-2 items-center">
        <ProjectActions
          projectUrl={page.data.links.url}
          githubUrl={page.data.links.github}
        />
      </div>

      <DocsBody id="docs-body" className="prose-lg-content pb-10 pt-4">
        <MDXContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return projects.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;
  if (slug.length === 0) {
    return sectionMetadata({ ...SECTION, path: '/projects' });
  }

  const page = projects.getPage(slug);
  if (!page) notFound();

  return pageMetadata({
    title: page.data.title,
    description: page.data.description,
    url: `${SITE.url}${page.url}`,
    image: ['/projects-og', ...slug, 'image.png'].join('/'),
    publishedTime: page.data.date,
  });
}
