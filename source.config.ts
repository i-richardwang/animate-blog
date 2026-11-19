import {
  defineConfig,
  defineDocs,
  defineCollections,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import remarkCjkFriendly from 'remark-cjk-friendly';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      // Either date within the last 30 days puts a badge on the note in the
      // sidebar (see lib/attach-file.tsx).
      releaseDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
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

// A cover or logo: a file in `public/`, named by its path from there
// (`/reading/covers/name.png`). Not a URL on someone else's server, which
// stops working the day they move the file.
const publicFile = z
  .string()
  .startsWith(
    '/',
    'Must be a file in public/, such as /reading/covers/name.png',
  );

export const projects = defineDocs({
  dir: 'content/projects',
  docs: {
    schema: frontmatterSchema.extend({
      date: z.coerce.date(),
      category: z.enum(['portfolio', 'business', 'exploration', 'personal']),
      tech: z.array(z.string()),
      logo: publicFile,
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
    image: publicFile,
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
    image: publicFile,
    podcastName: z.string(),
    hosts: z.array(z.string()),
    guests: z.array(z.string()),
    duration: z.string(),
    applePodcastUrl: z.string(),
    applePodcastId: z.string(),
    episodeId: z.string(),
  }),
});

export default defineConfig({
  mdxOptions: {
    // CommonMark only opens `**` when the character inside isn't punctuation
    // or the one outside is space or punctuation, so in Chinese such as
    // 这套**"手动 RAG"**的 the asterisks would stay literal. remark-cjk-friendly
    // applies the proposed CJK amendment to that rule.
    remarkPlugins: (plugins) => [remarkCjkFriendly, ...plugins],
  },
});
