import { podcasts, getNeighbours, getSortedPodcastPosts } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { Mic } from 'lucide-react';
import { PodcastList } from '@/components/docs/podcast-list';
import { ApplePodcastEmbed } from '@/components/docs/apple-podcast-embed';
import { CategoryLabel } from '@/components/docs/category-label';
import { ExternalLinkButton } from '@/components/docs/external-link-button';
import { PageTitle } from '@/components/docs/page-title';
import { pageMetadata, sectionMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/site';
import { formatDate } from '@/lib/utils';

const SECTION = {
  title: '推荐播客',
  description: '每周一期精选播客，聆听深度对话与思想碰撞。',
};

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    const posts = getSortedPodcastPosts().map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      podcastName: post.data.podcastName,
      hosts: post.data.hosts,
      guests: post.data.guests,
      duration: post.data.duration,
      image: post.data.image,
    }));

    return (
      <DocsPage tableOfContent={{ enabled: false }} className="!max-w-[1124px]">
        <DocsTitle className="font-medium">{SECTION.title}</DocsTitle>
        <DocsDescription className="mb-1 font-normal">
          {SECTION.description}
        </DocsDescription>

        <DocsBody id="docs-body" className="pb-10 pt-4">
          <PodcastList podcasts={posts} />
        </DocsBody>
      </DocsPage>
    );
  }

  const page = podcasts.getPage(slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const { date } = page.data;
  // Newest first: the previous episode is newer, the next one older.
  const { previous, next } = getNeighbours(getSortedPodcastPosts(), page.url);

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
        emptyLabels={{ previous: '没有更新的播客', next: '没有更早的播客' }}
      />

      <div className="text-sm text-muted-foreground mb-2">
        {page.data.podcastName}
      </div>

      <DocsDescription className="mb-1 font-normal">
        {page.data.description}
      </DocsDescription>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
        {page.data.hosts.length > 0 && (
          <div className="flex items-center gap-1">
            <Mic className="size-3" />
            <span>主播: {page.data.hosts.join(', ')}</span>
          </div>
        )}
        {page.data.guests.length > 0 && (
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
          {formatDate(date)}
        </time>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-sm text-muted-foreground">
          {page.data.duration}
        </span>
      </div>

      <div className="flex flex-row gap-2 items-center mt-4">
        <ExternalLinkButton href={page.data.applePodcastUrl}>
          在 Apple Podcasts 收听
        </ExternalLinkButton>
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
    return sectionMetadata({ ...SECTION, path: '/podcasts' });
  }

  const page = podcasts.getPage(slug);
  if (!page) notFound();

  return pageMetadata({
    title: page.data.title,
    description: page.data.description,
    url: `${SITE.url}${page.url}`,
    image: page.data.image,
    publishedTime: page.data.date,
  });
}
