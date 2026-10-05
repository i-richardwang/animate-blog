import { Feed } from 'feed';
import { blogs, source } from '@/lib/source';
import { SITE, SITE_AUTHOR } from '@/lib/site';

// Feed category for notes, by their section (the first URL segment).
const NOTE_CATEGORIES: Record<string, string> = {
  ai: 'AI Exploration',
  'data-science': 'Data Science',
  development: 'Development',
};

export function getRSS() {
  const author = { name: SITE_AUTHOR.name, link: SITE_AUTHOR.url };
  const feed = new Feed({
    title: SITE.name,
    id: SITE.url,
    link: SITE.url,
    language: 'en',
    description:
      'A personal blog and knowledge base for learning, exploration, and sharing insights.',
    image: `${SITE.url}/og-image.png`,
    favicon: `${SITE.url}/favicon-32x32.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Richard Wang`,
    feedLinks: {
      rss2: `${SITE.url}/rss.xml`,
    },
    author,
  });

  const entries = [
    ...blogs.getPages().map((post) => ({
      page: post,
      date: post.data.date,
      category: 'Blog',
    })),
    // Only notes with a releaseDate are published; section index pages
    // have none.
    ...source.getPages().flatMap((page) =>
      page.data.releaseDate
        ? [
            {
              page,
              date: page.data.releaseDate,
              category: NOTE_CATEGORIES[page.slugs[0]] ?? 'Docs',
            },
          ]
        : [],
    ),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  for (const { page, date, category } of entries) {
    const url = `${SITE.url}${page.url}`;
    feed.addItem({
      id: url,
      title: page.data.title,
      description: page.data.description ?? '',
      link: url,
      date,
      author: [author],
      category: [{ name: category }],
    });
  }

  return feed.rss2();
}
