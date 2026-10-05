import {
  defineConfig,
  defineDocs,
  defineCollections,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      releaseDate: z.coerce.date().optional(),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blogs',
  schema: frontmatterSchema.extend({
    date: z.coerce.date(),
  }),
});

export const projects = defineDocs({
  dir: 'content/projects',
  docs: {
    schema: frontmatterSchema.extend({
      date: z.coerce.date(),
      category: z.enum(['portfolio', 'business', 'exploration', 'personal']),
      tech: z.array(z.string()),
      logo: z.string(),
      links: z.object({
        github: z.string().optional(),
        url: z.string().optional(),
      }),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

const category = z.enum(['tech', 'humanity']);

export const reading = defineCollections({
  type: 'doc',
  dir: 'content/reading',
  schema: frontmatterSchema.extend({
    date: z.coerce.date(),
    category,
    image: z.string(),
    subtitle: z.string().optional(),
    originalTitle: z.string(),
    originalUrl: z.string(),
    // The original article's author.
    author: z.object({
      name: z.string(),
      url: z.string().optional(),
    }),
  }),
});

export const podcasts = defineCollections({
  type: 'doc',
  dir: 'content/podcasts',
  schema: frontmatterSchema.extend({
    date: z.coerce.date(),
    category,
    image: z.string(),
    podcastName: z.string(),
    hosts: z.array(z.string()),
    guests: z.array(z.string()),
    duration: z.string(),
    applePodcastUrl: z.string(),
    applePodcastId: z.string(),
    episodeId: z.string(),
  }),
});

export default defineConfig();
