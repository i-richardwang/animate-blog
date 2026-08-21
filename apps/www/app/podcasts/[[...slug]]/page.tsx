import { podcasts, getSortedPodcastPosts } from '@/lib/source';
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
import { ArrowLeft, ArrowRight, ExternalLink, Mic } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { PodcastList } from '@/components/docs/podcast-list';
import { ApplePodcastEmbed } from '@/components/docs/apple-podcast-embed';
import { CategoryBreadcrumb } from '@/components/docs/category-breadcrumb';
import { Shine } from '@/registry/primitives/effects/shine';
import { cn } from '@workspace/ui/lib/utils';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const posts = getSortedPodcastPosts().map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: new Date(post.data.date),
      podcastName: post.data.podcastName,
      episodeTitle: post.data.episodeTitle,
      hosts: post.data.hosts,
      guests: post.data.guests,
      duration: post.data.duration,
      image: post.data.image,
    }));

    return (
      <>
        <DocsPage
          toc={[]}
          tableOfContent={{ enabled: false }}
          className="!max-w-[1124px]"
        >
          <DocsTitle className="font-medium">推荐播客</DocsTitle>
          <DocsDescription className="mb-1 font-normal">
            每周一期精选播客，聆听深度对话与思想碰撞。
          </DocsDescription>

          <DocsBody id="docs-body" className="pb-10 pt-4">
            <PodcastList podcasts={posts} />
          </DocsBody>
        </DocsPage>
        <Footer />
      </>
    );
  }

  const page = podcasts.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const date = new Date(page.data.date);

  // Get sorted posts for navigation (newest first)
  const sortedPosts = getSortedPodcastPosts();
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
        toc={[]}
        tableOfContent={{ enabled: false }}
        className="!max-w-[860px]"
        footer={{
          items: {
            previous: prevNav
              ? { name: prevNav.name, url: prevNav.url }
              : undefined,
            next: nextNav
              ? { name: nextNav.name, url: nextNav.url }
              : undefined,
          },
        }}
      >
        <CategoryBreadcrumb category={page.data.category} />
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
                    prevNav ? `前往 ${prevNav.name}` : '没有更新的播客'
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
                    nextNav ? `前往 ${nextNav.name}` : '没有更早的播客'
                  }
                >
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground mb-2">
          {page.data.podcastName}
        </div>

        <DocsDescription className="mb-1 font-normal">
          {page.data.description}
        </DocsDescription>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
          {page.data.hosts?.length > 0 && (
            <div className="flex items-center gap-1">
              <Mic className="size-3" />
              <span>主播: {page.data.hosts.join(', ')}</span>
            </div>
          )}
          {page.data.guests?.length > 0 && (
            <>
              <span className="text-muted-foreground/50">|</span>
              <span>嘉宾: {page.data.guests.join(', ')}</span>
            </>
          )}
        </div>

        <div className="flex flex-row gap-2 items-center">
          <time
            dateTime={date.toISOString()}
            className="text-sm text-muted-foreground"
          >
            {format(date, 'MMM d, yyyy', { locale: enUS })}
          </time>
          {page.data.duration && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-sm text-muted-foreground">
                {page.data.duration}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-row gap-2 items-center mt-4">
          <Shine enableOnHover duration={1200} asChild>
            <a
              href={page.data.applePodcastUrl}
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
              <ExternalLink />在 Apple Podcasts 收听
            </a>
          </Shine>
        </div>

        <div className="mt-6 mb-8">
          <ApplePodcastEmbed
            podcastId={page.data.applePodcastId}
            episodeId={page.data.episodeId}
          />
        </div>

        <DocsBody id="docs-body" className="prose-lg-content pb-10 pt-4">
          <MDXContent components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  return podcasts.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    return {
      title: '推荐播客',
      description: '每周一期精选播客，聆听深度对话与思想碰撞。',
      openGraph: {
        title: '推荐播客',
        description: '每周一期精选播客，聆听深度对话与思想碰撞。',
        url: 'https://richardwang.me/podcasts',
        siteName: "Richard's Page",
        type: 'website',
        locale: 'zh_CN',
        images: [
          {
            url: 'https://richardwang.me/og-image.png',
            width: 1200,
            height: 630,
            alt: "Richard's Page",
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@richard2wang',
        title: '推荐播客',
        description: '每周一期精选播客，聆听深度对话与思想碰撞。',
        images: ['https://richardwang.me/og-image.png'],
      },
    };
  }

  const page = podcasts.getPage(slug);
  if (!page) notFound();

  const image =
    page.data.image || ['/podcasts-og', ...slug, 'image.png'].join('/');

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
