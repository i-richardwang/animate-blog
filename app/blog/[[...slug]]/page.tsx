import { blogs, getNeighbours, getSortedBlogPosts } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { DocsAuthor } from '@/components/docs/docs-author';
import { PageTitle } from '@/components/docs/page-title';
import { BlogList } from '@/components/docs/blog-list';
import { ExploreNotesCard } from '@/components/docs/explore-notes-card';
import { pageMetadata, sectionMetadata } from '@/lib/metadata';
import { SITE, SITE_AUTHOR } from '@/lib/site';
import { formatDate } from '@/lib/utils';

const SECTION = { title: '博客', description: '记录思考与探索的足迹' };

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const posts = getSortedBlogPosts().map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
    }));

    return (
      <DocsPage tableOfContent={{ enabled: false }} className="!max-w-[1124px]">
        <DocsTitle className="font-medium">{SECTION.title}</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          {SECTION.description}
        </DocsDescription>

        <DocsBody id="docs-body" className="pb-10 pt-4">
          <ExploreNotesCard />
          <div className="mt-6">
            <BlogList posts={posts} />
          </div>
        </DocsBody>
      </DocsPage>
    );
  }

  const page = blogs.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const { date } = page.data;
  // Newest first: the previous post is newer, the next one older.
  const { previous, next } = getNeighbours(getSortedBlogPosts(), page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContentPopover={{ enabled: false }}
      className="!max-w-[860px]"
      footer={{ items: { previous, next } }}
    >
      <PageTitle
        title={page.data.title}
        url={page.url}
        previous={previous}
        next={next}
        emptyLabels={{ previous: '没有更新的文章', next: '没有更早的文章' }}
      />
      <DocsDescription className="mb-1 font-normal">
        {page.data.description}
      </DocsDescription>
      <DocsAuthor {...SITE_AUTHOR} />

      <time
        dateTime={date.toISOString()}
        className="text-sm text-muted-foreground"
      >
        {formatDate(date)}
      </time>

      <DocsBody id="docs-body" className="prose-lg-content pb-10 pt-4">
        <MDXContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return blogs.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;
  if (slug.length === 0) return sectionMetadata({ ...SECTION, path: '/blog' });

  const page = blogs.getPage(slug);
  if (!page) notFound();

  return pageMetadata({
    title: page.data.title,
    description: page.data.description,
    url: `${SITE.url}${page.url}`,
    image: ['/blog-og', ...slug, 'image.png'].join('/'),
    publishedTime: page.data.date,
  });
}
