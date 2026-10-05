import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
  EditOnGitHub,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { Metadata } from 'next';
import { DocsAuthor } from '@/components/docs/docs-author';
import { SITE_AUTHOR } from '@/lib/site';
import { ViewOptions, LLMCopyButton } from '@/components/docs/page-actions';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
      full={page.data.full}
      className="!max-w-[860px]"
      breadcrumb={{ enabled: true }}
      slots={{ breadcrumb: SectionLabel }}
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
                aria-label={
                  prevNav ? `Aller à ${prevNav.name}` : 'Pas de page précédente'
                }
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
                aria-label={
                  nextNav ? `Aller à ${nextNav.name}` : 'Pas de page suivante'
                }
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
      {!isSectionIndex && <DocsAuthor {...SITE_AUTHOR} />}

      <div className="flex flex-row gap-2 items-center">
        <EditOnGitHub
          className="border-0 [&_svg]:text-fd-muted-foreground"
          href={`https://github.com/i-richardwang/animate-blog/blob/main/content/docs/${params.slug ? `${params.slug.join('/')}.mdx` : 'index.mdx'}`}
        />
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/i-richardwang/animate-blog/blob/main/content/docs/${page.path}`}
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

  const image = ['/docs-og', ...slug, 'image.png'].join('/');

  return {
    title: page.data.title,
    description: page.data.description,
    authors: [SITE_AUTHOR],
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: 'https://richardwang.me',
      siteName: "Richard's Page",
      images: image,
      locale: 'zh_CN',
      type: 'website',
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
