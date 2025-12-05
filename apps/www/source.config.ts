import {
  defineConfig,
  defineDocs,
  defineCollections,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      releaseDate: z.coerce.date().optional(),
      beta: z.boolean().optional(),
      alpha: z.boolean().optional(),
      updated: z.boolean().optional(),
      deprecated: z.boolean().optional(),
      author: z
        .object({
          name: z.string(),
          url: z.string().optional(),
        })
        .optional(),
    }),
  },
  meta: {
    schema: metaSchema,
  },
  // Exclude Animate UI original documentation directories
  // These are component library docs, not personal content
  dir: 'content/docs',
  // Note: We'll handle filtering at the source loader level in lib/source.ts
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blogs',
  schema: frontmatterSchema.extend({
    date: z.coerce.date(),
    author: z
      .object({
        name: z.string(),
        url: z.string().optional(),
        avatar: z.string().optional(),
      })
      .optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const projects = defineDocs({
  docs: {
  schema: frontmatterSchema.extend({
    date: z.coerce.date(),
    tech: z.array(z.string()).default([]),
    links: z
      .object({
        github: z.string().optional(),
        url: z.string().optional(),
      })
      .optional(),
    image: z.string().optional(),
    logo: z.string().optional(),
    featured: z.boolean().default(false),
    category: z.enum(['showcase', 'opensource', 'product']).optional(),
  }),
  },
  meta: {
    schema: metaSchema,
  },
  dir: 'content/projects',
});

export const reading = defineCollections({
  type: 'doc',
  dir: 'content/reading',
  schema: frontmatterSchema.extend({
    date: z.coerce.date(),
    author: z
      .object({
        name: z.string(),
        url: z.string().optional(),
      })
      .optional(),
    originalUrl: z.string(),
    image: z.string().optional(),
    category: z.enum(['tech', 'humanity']).optional(),
    subtitle: z.string().optional(),
  }),
});

export default defineConfig({
  lastModifiedTime: 'git',
    mdxOptions: {
    rehypePlugins: [],
  },
});
