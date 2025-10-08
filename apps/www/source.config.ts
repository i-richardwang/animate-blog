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

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    rehypePlugins: [],
  },
});
