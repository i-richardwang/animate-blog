import { reading, getSortedReadingPosts } from '@/lib/source';
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
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ReadingList } from '@/components/docs/reading-list';
import { DocsAuthor } from '@/components/docs/docs-author';
import { Shine } from '@/registry/primitives/effects/shine';
import { cn } from '@workspace/ui/lib/utils';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const posts = getSortedReadingPosts().map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: new Date(post.data.date),
      author: post.data.author,
      originalUrl: post.data.originalUrl,
      image: post.data.image,
    }));

    return (
      <>
        <DocsPage toc={[]} article={{ className: '!max-w-[1124px]' }}>
          <DocsTitle className="font-medium">推荐阅读</DocsTitle>
          <DocsDescription className="mb-1 font-normal">
            精选优质文章，中文翻译呈现
          </DocsDescription>

          <DocsBody id="docs-body" className="pb-10 pt-4">
            <ReadingList readings={posts} />
          </DocsBody>
        </DocsPage>
        <Footer />
      </>
    );
  }

  const page = reading.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const date = new Date(page.data.date);

  // Get sorted posts for navigation (newest first)
  const sortedPosts = getSortedReadingPosts();
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

        <div className="flex flex-row gap-2 items-center">
          <time
            dateTime={date.toISOString()}
            className="text-sm text-muted-foreground"
          >
            {format(date, 'MMM d, yyyy', { locale: enUS })}
          </time>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Shine enableOnHover duration={1200} asChild>
            <a
              href={page.data.originalUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                buttonVariants({
                  color: 'ghost',
                  size: 'sm',
                  className:
                    'gap-2 [&_svg]:size-3.5 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:text-primary-foreground border-0',
                }),
              )}
            >
              <ExternalLink />
              View Original
            </a>
          </Shine>
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
  return reading.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    return {
      title: '推荐阅读',
      description: '精选优质文章，中文翻译呈现',
      openGraph: {
        title: '推荐阅读',
        description: '精选优质文章，中文翻译呈现',
        url: 'https://richardwang.me/reading',
        siteName: "Richard's Page",
        type: 'website',
        locale: 'zh_CN',
      },
    };
  }

  const page = reading.getPage(slug);
  if (!page) notFound();

  const image = page.data.image || ['/reading-og', ...slug, 'image.png'].join('/');

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
