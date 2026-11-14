import { blogs, getNeighbours, getSortedBlogPosts } from '@/lib/source';
import { DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { SitePage } from '@/components/docs/page';
import { SiteBody } from '@/components/docs/site-body';
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

export default async function Page(props: PageProps<'/blog/[[...slug]]'>) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const posts = getSortedBlogPosts().map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
    }));

    return (
      <SitePage tableOfContent={{ enabled: false }} className="max-w-[1124px]">
        <DocsTitle className="font-medium">{SECTION.title}</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          {SECTION.description}
        </DocsDescription>

        <SiteBody>
          <ExploreNotesCard />
          <div className="mt-6">
            <BlogList posts={posts} />
          </div>
        </SiteBody>
      </SitePage>
    );
  }

  const page = blogs.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const { date } = page.data;
  // Newest first: the previous post is newer, the next one older.
  const { previous, next } = getNeighbours(getSortedBlogPosts(), page.url);

  return (
    <SitePage
      toc={page.data.toc}
      tableOfContentPopover={{ enabled: false }}
      className="max-w-[860px]"
      footer={{ items: { previous, next } }}
    >
      <PageTitle title={page.data.title} previous={previous} next={next} />
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

      <SiteBody article>
        <MDXContent components={getMDXComponents()} />
      </SiteBody>
    </SitePage>
  );
}

export async function generateStaticParams() {
  return blogs.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/blog/[[...slug]]'>,
): Promise<Metadata> {
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
