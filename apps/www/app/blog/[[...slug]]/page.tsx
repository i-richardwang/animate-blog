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
import { ArrowLeft } from 'lucide-react';
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
      tags: post.data.tags,
    }));

    return (
      <>
        <DocsPage toc={[]}>
          <DocsTitle className="font-medium">Blog</DocsTitle>
          <DocsDescription className="mb-1 font-normal">
            Latest updates, tutorials, and insights from Animate UI
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

  return (
    <>
      <DocsPage toc={page.data.toc}>
        <div className="flex flex-row gap-2 items-start w-full justify-between">
          <DocsTitle className="font-medium">{page.data.title}</DocsTitle>
          <div className="flex flex-row gap-1.5 items-center pt-0.5">
            <Link href="/blog">
              <Button variant="accent" size="sm">
                <ArrowLeft />
                Back to Blog
              </Button>
            </Link>
          </div>
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
          {page.data.tags && page.data.tags.length > 0 && (
            <>
              {page.data.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </>
          )}
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
  return blogs.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;

  if (slug.length === 0) {
    return {
      title: 'Blog',
      description:
        'Latest updates, tutorials, and insights from Animate UI. Learn about animated components, Motion API, and best practices.',
      openGraph: {
        title: 'Blog - Animate UI',
        description: 'Latest updates, tutorials, and insights from Animate UI',
        url: 'https://animate-ui.com/blog',
        siteName: 'Animate UI',
        type: 'website',
        locale: 'en_US',
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
          name: 'imskyleen',
          url: 'https://github.com/imskyleen',
        },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: `https://animate-ui.com${page.url}`,
      siteName: 'Animate UI',
      type: 'article',
      publishedTime: new Date(page.data.date).toISOString(),
      locale: 'en_US',
      images: page.data.image || image,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@animate_ui',
      title: page.data.title,
      description: page.data.description,
      images: page.data.image || image,
    },
  };
}
