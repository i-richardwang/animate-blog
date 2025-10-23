import { projects, getSortedProjects } from '@/lib/source';
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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProjectList } from '@/components/docs/project-list';
import { ProjectActions } from '@/components/docs/page-actions';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const projectsData = getSortedProjects().map((project) => ({
      url: project.url,
      title: project.data.title,
      description: project.data.description,
      date: new Date(project.data.date),
      tech: project.data.tech,
      links: project.data.links,
      image: project.data.image,
      logo: project.data.logo,
      featured: project.data.featured,
    }));

    const openSourceProjects = projectsData.filter(
      (project) => project.links?.github,
    );
    const otherProjects = projectsData.filter(
      (project) => !project.links?.github,
    );

    return (
      <>
        <DocsPage toc={[]}>
          <DocsTitle className="font-medium">Projects</DocsTitle>
          <DocsDescription className="mb-1 font-normal">
            A collection of projects I&apos;ve built and contributed to
          </DocsDescription>

          <DocsBody id="docs-body" className="pb-10 pt-4">
            {openSourceProjects.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-medium mb-6 text-foreground">
                  Open Source
                </h2>
                <ProjectList projects={openSourceProjects} />
              </section>
            )}

            {otherProjects.length > 0 && (
              <section>
                <h2 className="text-xl font-medium mb-6 text-foreground">
                  Personal Projects
                </h2>
                <ProjectList projects={otherProjects} />
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

  return (
    <>
      <DocsPage toc={page.data.toc}>
        <div className="flex flex-row gap-2 items-start w-full justify-between">
          <DocsTitle className="font-medium">{page.data.title}</DocsTitle>
          <div className="flex flex-row gap-1.5 items-center pt-0.5">
            <Button variant="accent" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft />
                Back to Projects
              </Link>
            </Button>
          </div>
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

        <DocsBody id="docs-body" className="pb-10 pt-4">
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
      title: 'Projects',
      description:
        "A collection of projects I've built and contributed to. Exploring ideas through code and design.",
      openGraph: {
        title: 'Projects',
        description: "A collection of projects I've built and contributed to",
        url: 'https://richardwang.me/projects',
        siteName: "Richard's Page",
        type: 'website',
        locale: 'en_US',
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
      locale: 'en_US',
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
