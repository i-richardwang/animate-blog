import { source, blogs, projects } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';

// Using createSearchAPI with explicit Mandarin tokenizer for Chinese content
// The @orama/tokenizers/mandarin package provides proper Chinese word segmentation
export const { GET } = createSearchAPI('advanced', {
  indexes: [
    // Index docs content
    ...source.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
    })),
    // Index blog posts
    ...blogs.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
    })),
    // Index projects
    ...projects.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
    })),
  ],
  // Configure Orama with Mandarin tokenizer
  tokenizer: createTokenizer(),
});
