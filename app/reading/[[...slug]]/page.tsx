import { reading, getNeighbours, getSortedReadingPosts } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { ReadingList } from '@/components/docs/reading-list';
import { DocsAuthor } from '@/components/docs/docs-author';
import { DocsSubtitle } from '@/components/docs/docs-subtitle';
import { CategoryLabel } from '@/components/docs/category-label';
import { ExternalLinkButton } from '@/components/docs/external-link-button';
import { PageTitle } from '@/components/docs/page-title';
import { pageMetadata, sectionMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/site';
import { formatDate } from '@/lib/utils';

const SECTION = {
  title: '推荐阅读',
  description: '每周一篇深度好文，扩展技术与认知边界。',
};

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const posts = getSortedReadingPosts().map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      author: post.data.author,
      image: post.data.image,
    }));

    return (
      <DocsPage tableOfContent={{ enabled: false }} className="!max-w-[1124px]">
        <DocsTitle className="font-medium">{SECTION.title}</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          {SECTION.description}
        </DocsDescription>

        <DocsBody id="docs-body" className="pb-10 pt-4">
          <ReadingList readings={posts} />
        </DocsBody>
      </DocsPage>
    );
  }

  const page = reading.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const { date } = page.data;
  // Newest first: the previous post is newer, the next one older.
  const { previous, next } = getNeighbours(getSortedReadingPosts(), page.url);

  return (
    <DocsPage
      tableOfContent={{ enabled: false }}
      className="!max-w-[860px]"
      footer={{ items: { previous, next } }}
    >
      <CategoryLabel category={page.data.category} />
      <PageTitle
        title={page.data.title}
        url={page.url}
        previous={previous}
        next={next}
        emptyLabels={{ previous: '没有更新的文章', next: '没有更早的文章' }}
      />
      <DocsSubtitle>{page.data.subtitle}</DocsSubtitle>
      <DocsDescription className="mb-1 font-normal">
        {page.data.description}
      </DocsDescription>
      <DocsAuthor {...page.data.author} />

      <div className="flex flex-row gap-2 items-center">
        <time
          dateTime={date.toISOString()}
          className="text-sm text-muted-foreground"
        >
          {formatDate(date)}
        </time>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <ExternalLinkButton href={page.data.originalUrl}>
          阅读原文:《{page.data.originalTitle}》by {page.data.author.name}
        </ExternalLinkButton>
      </div>

      <DocsBody id="docs-body" className="prose-lg-content pb-10 pt-4">
        <MDXContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return reading.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;
  if (slug.length === 0) {
    return sectionMetadata({ ...SECTION, path: '/reading' });
  }

  const page = reading.getPage(slug);
  if (!page) notFound();

  return pageMetadata({
    title: page.data.title,
    description: page.data.description,
    url: `${SITE.url}${page.url}`,
    image: page.data.image,
    publishedTime: page.data.date,
    authors: [page.data.author],
  });
}
