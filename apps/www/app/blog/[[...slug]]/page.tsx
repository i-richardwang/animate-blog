import { blogs, getSortedBlogPosts } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { Metadata } from 'next';
import { DocsAuthor } from '@/components/docs/docs-author';
import { Footer } from '@/components/footer';
import { Button } from '@/registry/components/buttons/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { BlogList } from '@/components/docs/blog-list';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const posts = getSortedBlogPosts().map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: new Date(post.data.date),
    }));

    return (
      <>
        <DocsPage toc={[]} article={{ className: '!max-w-[1124px]' }}>
          <DocsTitle className="font-medium">博客</DocsTitle>
          <DocsDescription className="mb-1 font-normal">
            记录思考与探索的足迹
          </DocsDescription>

          <DocsBody id="docs-body" className="pb-10 pt-4">
            <BlogList posts={posts} />
          </DocsBody>
        </DocsPage>
        <Footer />
      </>
    );
  }

  const page = blogs.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const date = new Date(page.data.date);

  // Get sorted posts for navigation (newest first)
  const sortedPosts = getSortedBlogPosts();
  const currentIndex = sortedPosts.findIndex((p) => p.url === page.url);

  // Previous is newer (lower index), Next is older (higher index)
  const prevNav =
    currentIndex > 0
      ? {
          url: sortedPosts[currentIndex - 1].url,
          name: sortedPosts[currentIndex - 1].data.title,
        }
      : undefined;

  const nextNav =
    currentIndex < sortedPosts.length - 1
      ? {
          url: sortedPosts[currentIndex + 1].url,
          name: sortedPosts[currentIndex + 1].data.title,
        }
      : undefined;

  return (
    <>
      <DocsPage
        toc={page.data.toc}
        article={{ className: '!max-w-[860px]' }}
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
                  aria-label={prevNav ? `前往 ${prevNav.name}` : '没有更新的文章'}
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
                  aria-label={nextNav ? `前往 ${nextNav.name}` : '没有更早的文章'}
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
        {page.data.author && (
          <DocsAuthor
            name={page.data.author.name}
            url={page.data.author?.url}
          />
        )}

        <time
          dateTime={date.toISOString()}
          className="text-sm text-muted-foreground"
        >
          {format(date, 'MMM d, yyyy', { locale: enUS })}
        </time>

        <DocsBody id="docs-body" className="pb-10 pt-4">
          <MDXContent components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  return blogs.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    return {
      title: '博客',
      description: '记录思考与探索的足迹',
      openGraph: {
        title: '博客',
        description: '记录思考与探索的足迹',
        url: 'https://richardwang.me/blog',
        siteName: "Richard's Page",
        type: 'website',
        locale: 'zh_CN',
      },
    };
  }

  const page = blogs.getPage(slug);
  if (!page) notFound();

  const image = ['/blog-og', ...slug, 'image.png'].join('/');

  return {
    title: page.data.title,
    description: page.data.description,
    authors: page.data?.author
      ? [
          {
            name: page.data.author.name,
            ...(page.data.author?.url && { url: page.data.author.url }),
          },
        ]
      : {
          name: 'Richard Wang',
          url: 'https://github.com/i-richardwang',
        },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: `https://richardwang.me${page.url}`,
      siteName: "Richard's Page",
      type: 'article',
      publishedTime: new Date(page.data.date).toISOString(),
      locale: 'zh_CN',
      images: page.data.image || image,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@richard2wang',
      title: page.data.title,
      description: page.data.description,
      images: page.data.image || image,
    },
  };
}
