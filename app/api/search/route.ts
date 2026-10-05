import { source, blogs, projects } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

// Notes, blog posts and projects, indexed with a Mandarin tokenizer so
// Chinese text is segmented into words.
export const { GET } = createSearchAPI('advanced', {
  indexes: [source, blogs, projects].flatMap((loader) =>
    loader.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
    })),
  ),
  tokenizer: createTokenizer(),
});
