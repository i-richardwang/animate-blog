import { source, getNoteNeighbours } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  EditOnGitHub,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { DocsAuthor } from '@/components/docs/docs-author';
import { SITE, SITE_AUTHOR } from '@/lib/site';
import { pageMetadata } from '@/lib/metadata';
import { PageTitle } from '@/components/docs/page-title';
import { ViewOptions, LLMCopyButton } from '@/components/docs/page-actions';
import { SectionLabel } from '@/components/docs/section-label';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  // Section landing pages (index.mdx) are not authored notes.
  const isSectionIndex = /(^|\/)index\.mdx$/.test(page.path);

  const { previous, next } = getNoteNeighbours(page.url);
  const githubUrl = `${SITE.repo}/blob/main/content/docs/${page.path}`;

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContentPopover={{ enabled: false }}
      className="!max-w-[860px]"
      slots={{ breadcrumb: SectionLabel }}
      footer={{ items: { previous, next } }}
    >
      <PageTitle
        title={page.data.title}
        url={page.url}
        previous={previous}
        next={next}
        emptyLabels={{ previous: '没有上一篇笔记', next: '没有下一篇笔记' }}
      />
      <DocsDescription className="mb-1 font-normal">
        {page.data.description}
      </DocsDescription>
      {!isSectionIndex && <DocsAuthor {...SITE_AUTHOR} />}

      <div className="flex flex-row gap-2 items-center">
        <EditOnGitHub
          className="border-0 [&_svg]:text-fd-muted-foreground"
          href={githubUrl}
        />
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions markdownUrl={`${page.url}.mdx`} githubUrl={githubUrl} />
      </div>

      <DocsBody id="docs-body" className="pb-10 pt-4">
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return pageMetadata({
    title: page.data.title,
    description: page.data.description,
    url: `${SITE.url}${page.url}`,
    image: ['/docs-og', ...slug, 'image.png'].join('/'),
    publishedTime: page.data.releaseDate,
  });
}
