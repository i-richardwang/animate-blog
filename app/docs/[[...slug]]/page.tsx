import { source } from '@/lib/source';
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
import { findNeighbour } from 'fumadocs-core/page-tree';
import { SectionLabel } from '@/components/docs/section-label';
import { baseOptions } from '@/app/layout.config';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  // Section landing pages (index.mdx) are not authored notes.
  const isSectionIndex = /(^|\/)index\.mdx$/.test(page.path);

  const tree = source.getPageTree();
  const { previous, next: nextPage } = findNeighbour(tree, page.url);

  type GuideLink = { text: string; url: string };
  const isGuideLink = (l: unknown): l is GuideLink => {
    if (typeof l !== 'object' || l === null) return false;
    const obj = l as Record<string, unknown>;
    return typeof obj.url === 'string' && typeof obj.text === 'string';
  };
  const guideItems = (baseOptions.links ?? []).filter(isGuideLink);
  const guideIndex = guideItems.findIndex((it) => it.url === page.url);

  const prevNav = (() => {
    if (guideIndex >= 0 && guideItems.length > 0) {
      if (guideIndex > 0) {
        return {
          url: guideItems[guideIndex - 1].url,
          name: guideItems[guideIndex - 1].text,
        } as const;
      }
      return undefined;
    }

    if (previous) {
      return {
        url: previous.url,
        name: String(previous.name ?? 'Précédent'),
      } as const;
    }

    if (page.url.startsWith('/docs/ai/')) {
      return { url: '/docs/ai', name: 'AI 探索' } as const;
    }
    if (page.url.startsWith('/docs/data-science/')) {
      return { url: '/docs/data-science', name: '数据科学' } as const;
    }
    if (page.url.startsWith('/docs/development/')) {
      return { url: '/docs/development', name: '开发实践' } as const;
    }

    const isSectionRoot =
      page.url === '/docs/ai' ||
      page.url === '/docs/data-science' ||
      page.url === '/docs/development';
    if (isSectionRoot && guideItems.length > 0) {
      const last = guideItems[guideItems.length - 1];
      return { url: last.url, name: last.text } as const;
    }

    return undefined;
  })();

  const nextNav =
    guideIndex >= 0 && guideItems.length > 0
      ? guideIndex < guideItems.length - 1
        ? {
            url: guideItems[guideIndex + 1].url,
            name: guideItems[guideIndex + 1].text,
          }
        : { url: '/docs/ai', name: 'AI 探索' }
      : nextPage
        ? { url: nextPage.url, name: String(nextPage.name ?? 'Suivant') }
        : undefined;

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContentPopover={{ enabled: false }}
      className="!max-w-[860px]"
      slots={{ breadcrumb: SectionLabel }}
      footer={{ items: { previous: prevNav, next: nextNav } }}
    >
      <PageTitle
        title={page.data.title}
        url={page.url}
        previous={prevNav}
        next={nextNav}
        emptyLabels={{ previous: '没有上一篇笔记', next: '没有下一篇笔记' }}
      />
      <DocsDescription className="mb-1 font-normal">
        {page.data.description}
      </DocsDescription>
      {!isSectionIndex && <DocsAuthor {...SITE_AUTHOR} />}

      <div className="flex flex-row gap-2 items-center">
        <EditOnGitHub
          className="border-0 [&_svg]:text-fd-muted-foreground"
          href={`${SITE.repo}/blob/main/content/docs/${params.slug ? `${params.slug.join('/')}.mdx` : 'index.mdx'}`}
        />
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`${SITE.repo}/blob/main/content/docs/${page.path}`}
        />
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
    url: SITE.url,
    image: ['/docs-og', ...slug, 'image.png'].join('/'),
  });
}
