import { Feed } from 'feed';
import { blogs, source } from '@/lib/source';
import { SITE_AUTHOR } from '@/lib/site';

const baseUrl = 'https://richardwang.me';

type FeedItem = {
  url: string;
  title: string;
  description: string;
  date: Date;
  category: string;
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
      name: SITE_AUTHOR.name,
      link: SITE_AUTHOR.url,
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
      category: 'Blog',
    });
  }

  // Add documentation pages
  const docPages = source.getPages();
  for (const page of docPages) {
    // Only notes with a releaseDate are published to the feed; section
    // index pages have none.
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
      author: [{ name: SITE_AUTHOR.name, link: SITE_AUTHOR.url }],
      category: [{ name: item.category }],
    });
  }

  return feed.rss2();
}
