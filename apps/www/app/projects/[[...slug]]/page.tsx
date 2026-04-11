import { projects } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Button } from '@/registry/components/buttons/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProjectList } from '@/components/docs/project-list';
import { ProjectActions } from '@/components/docs/page-actions';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    // Get pages in the order defined by pageTree (which follows meta.json)
    const tree = projects.pageTree;
    const orderedUrls: string[] = [];
    
    // Extract URLs from pageTree in order, skipping separators
    for (const node of tree.children) {
      if (node.type === 'page') {
        orderedUrls.push(node.url);
      }
    }

    // Create a map for quick lookup
    const pagesMap = new Map(
      projects.getPages().map((page) => [page.url, page])
    );

    // Build projectsData in the correct order
    const projectsData = orderedUrls
      .map((url) => {
        const project = pagesMap.get(url);
        if (!project) return null;
        return {
          url: project.url,
          title: project.data.title,
          description: project.data.description,
          tech: project.data.tech,
          links: project.data.links,
          image: project.data.image,
          logo: project.data.logo,
          featured: project.data.featured,
          category: project.data.category,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    const developerProjects = projectsData.filter(
      (project) => project.category === 'developer',
    );
    const productivityProjects = projectsData.filter(
      (project) => project.category === 'productivity',
    );
    const dataProjects = projectsData.filter(
      (project) => project.category === 'data',
    );
    const talentProjects = projectsData.filter(
      (project) => project.category === 'talent',
    );
    const learningProjects = projectsData.filter(
      (project) => project.category === 'learning',
    );
    const personalProjects = projectsData.filter(
      (project) => project.category === 'personal',
    );

    return (
      <>
        <DocsPage toc={[]} article={{ className: '!max-w-[1124px]' }}>
          <DocsTitle className="font-medium">项目</DocsTitle>
          <DocsDescription className="mb-1 font-normal">
            探索技术，构建产品
          </DocsDescription>

          <DocsBody id="docs-body" className="pb-10 pt-4">
            {developerProjects.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-medium mb-6 text-foreground">
                  开发者工具
                </h2>
                <ProjectList projects={developerProjects} />
              </section>
            )}

            {productivityProjects.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-medium mb-6 text-foreground">
                  效率产品
                </h2>
                <ProjectList projects={productivityProjects} />
              </section>
            )}

            {dataProjects.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-medium mb-6 text-foreground">
                  AI 数据应用
                </h2>
                <ProjectList projects={dataProjects} />
              </section>
            )}

            {talentProjects.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-medium mb-6 text-foreground">
                  AI 人才应用
                </h2>
                <ProjectList projects={talentProjects} />
              </section>
            )}

            {learningProjects.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-medium mb-6 text-foreground">
                  学习资源
                </h2>
                <ProjectList projects={learningProjects} />
              </section>
            )}

            {personalProjects.length > 0 && (
              <section>
                <h2 className="text-xl font-medium mb-6 text-foreground">
                  个人空间
                </h2>
                <ProjectList projects={personalProjects} />
              </section>
            )}
          </DocsBody>
        </DocsPage>
        <Footer />
      </>
    );
  }

  const page = projects.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  // Get ordered URLs from pageTree (follows meta.json order)
  const tree = projects.pageTree;
  const orderedUrls: string[] = [];
  for (const node of tree.children) {
    if (node.type === 'page') {
      orderedUrls.push(node.url);
    }
  }

  // Find current position and neighbors
  const currentIndex = orderedUrls.indexOf(page.url);
  const pagesMap = new Map(
    projects.getPages().map((p) => [p.url, p]),
  );

  const prevNav =
    currentIndex > 0
      ? {
          url: orderedUrls[currentIndex - 1],
          name: pagesMap.get(orderedUrls[currentIndex - 1])?.data.title ?? '',
        }
      : undefined;

  const nextNav =
    currentIndex < orderedUrls.length - 1
      ? {
          url: orderedUrls[currentIndex + 1],
          name: pagesMap.get(orderedUrls[currentIndex + 1])?.data.title ?? '',
        }
      : undefined;

  return (
    <>
      <DocsPage
        toc={[]}
        article={{ className: '!max-w-[860px]' }}
        breadcrumb={{ enabled: true, includeSeparator: true }}
        footer={{
          items: {
            previous: prevNav
              ? { name: prevNav.name, url: prevNav.url }
              : undefined,
            next: nextNav ? { name: nextNav.name, url: nextNav.url } : undefined,
          },
        }}
      >
        <div className="flex flex-row gap-2 items-start w-full justify-between">
          <DocsTitle className="font-medium">{page.data.title}</DocsTitle>
          {(prevNav || nextNav) && (
            <div className="flex flex-row gap-1.5 items-center pt-0.5">
              <Button variant="accent" size="icon-sm" asChild>
                <Link
                  href={prevNav?.url ?? page.url}
                  aria-disabled={!prevNav}
                  className={
                    !prevNav ? 'pointer-events-none opacity-50' : undefined
                  }
                  aria-label={prevNav ? `前往 ${prevNav.name}` : '没有上一个项目'}
                >
                  <ArrowLeft />
                </Link>
              </Button>
              <Button variant="accent" size="icon-sm" asChild>
                <Link
                  href={nextNav?.url ?? page.url}
                  aria-disabled={!nextNav}
                  className={
                    !nextNav ? 'pointer-events-none opacity-50' : undefined
                  }
                  aria-label={nextNav ? `前往 ${nextNav.name}` : '没有下一个项目'}
                >
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>
        <DocsDescription className="mb-1 font-normal">
          {page.data.description}
        </DocsDescription>

        {page.data.tech && page.data.tech.length > 0 && (
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
            projectUrl={page.data.links?.url}
            githubUrl={page.data.links?.github}
          />
        </div>

        <DocsBody id="docs-body" className="prose-lg-content pb-10 pt-4">
          <MDXContent components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
      <Footer />
    </>
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
    return {
      title: '项目',
      description: '探索技术，构建产品',
      openGraph: {
        title: '项目',
        description: '探索技术，构建产品',
        url: 'https://richardwang.me/projects',
        siteName: "Richard's Page",
        type: 'website',
        locale: 'zh_CN',
        images: [
          {
            url: 'https://richardwang.me/og-image.png',
            width: 1200,
            height: 630,
            alt: "Richard's Page",
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@richard2wang',
        title: '项目',
        description: '探索技术，构建产品',
        images: ['https://richardwang.me/og-image.png'],
      },
    };
  }

  const page = projects.getPage(slug);
  if (!page) notFound();

  const image =
    page.data.image || ['/projects-og', ...slug, 'image.png'].join('/');

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: `https://richardwang.me${page.url}`,
      siteName: "Richard's Page",
      type: 'article',
      publishedTime: new Date(page.data.date).toISOString(),
      locale: 'zh_CN',
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@richard2wang',
      title: page.data.title,
      description: page.data.description,
      images: image,
    },
  };
}
