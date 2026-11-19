import { reading, getNeighbours, getSortedReadingPosts } from '@/lib/source';
import { DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { ArticlePage, SectionPage } from '@/components/docs/page';
import { SiteBody } from '@/components/docs/site-body';
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

export default async function Page(props: PageProps<'/reading/[[...slug]]'>) {
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
      <SectionPage>
        <DocsTitle className="font-medium">{SECTION.title}</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          {SECTION.description}
        </DocsDescription>

        <SiteBody>
          <ReadingList readings={posts} />
        </SiteBody>
      </SectionPage>
    );
  }

  const page = reading.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const { date } = page.data;
  // Newest first: the previous post is newer, the next one older.
  const { previous, next } = getNeighbours(getSortedReadingPosts(), page.url);

  return (
    <ArticlePage toc={page.data.toc} footer={{ items: { previous, next } }}>
      <CategoryLabel category={page.data.category} />
      <PageTitle title={page.data.title} previous={previous} next={next} />
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

      <SiteBody article>
        <MDXContent components={getMDXComponents()} />
      </SiteBody>
    </ArticlePage>
  );
}

export async function generateStaticParams() {
  return reading.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/reading/[[...slug]]'>,
): Promise<Metadata> {
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
