import { Feed } from 'feed';
import { blogs, source } from '@/lib/source';

const baseUrl = 'https://richardwang.me';

type FeedItem = {
  url: string;
  title: string;
  description: string;
  date: Date;
  author: {
    name: string;
    url?: string;
  };
  image?: string;
  category?: string;
};

export function getRSS() {
  const feed = new Feed({
    title: "Richard's Page",
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    description:
      'A personal blog and knowledge base for learning, exploration, and sharing insights.',
    image: `${baseUrl}/og-image.png`,
    favicon: `${baseUrl}/favicon-32x32.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Richard Wang`,
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`,
    },
    author: {
      name: 'Richard Wang',
      link: 'https://github.com/i-richardwang',
    },
  });

  const items: FeedItem[] = [];

  // Add blog posts
  const blogPosts = blogs.getPages();
  for (const post of blogPosts) {
    items.push({
      url: post.url,
      title: post.data.title,
      description: post.data.description ?? '',
      date: new Date(post.data.date),
      author: post.data.author
        ? {
            name: post.data.author.name,
            url: post.data.author.url,
          }
        : {
            name: 'Richard Wang',
            url: 'https://github.com/i-richardwang',
          },
      image: post.data.image,
      category: 'Blog',
    });
  }

  // Add documentation pages
  const docPages = source.getPages();
  for (const page of docPages) {
    // Exclude index pages and pages not suitable for RSS
    if (
      page.url === '/docs' ||
      page.url === '/docs/components' ||
      page.url === '/docs/primitives' ||
      page.url === '/docs/icons' ||
      page.url.includes('/index')
    ) {
      continue;
    }

    // Only include pages with explicit releaseDate in frontmatter
    // Skip pages without a manually configured release date
    if (!page.data.releaseDate) continue;

    const itemDate = new Date(page.data.releaseDate);

    // Determine category
    let category = 'Docs';
    if (page.url.startsWith('/docs/ai')) {
      category = 'AI Exploration';
    } else if (page.url.startsWith('/docs/data-science')) {
      category = 'Data Science';
    } else if (page.url.startsWith('/docs/development')) {
      category = 'Development';
    }

    items.push({
      url: page.url,
      title: page.data.title,
      description: page.data.description ?? '',
      date: itemDate,
      author: page.data.author
        ? {
            name: page.data.author.name,
            url: page.data.author.url,
          }
        : {
            name: 'Richard Wang',
            url: 'https://github.com/i-richardwang',
          },
      category,
    });
  }

  // Sort by date (newest first)
  items.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Add all items to feed
  for (const item of items) {
    const itemUrl = `${baseUrl}${item.url}`;

    feed.addItem({
      id: itemUrl,
      title: item.title,
      description: item.description,
      link: itemUrl,
      date: item.date,
      author: [
        {
          name: item.author.name,
          link: item.author.url,
        },
      ],
      category: item.category ? [{ name: item.category }] : undefined,
      image: item.image ? `${baseUrl}${item.image}` : undefined,
    });
  }

  return feed.rss2();
}
