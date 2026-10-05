<div align="center">
  <h1>Richard's Page</h1>
  <p>The source of <a href="https://richardwang.me">richardwang.me</a>, a personal blog and knowledge base.</p>

<a href="https://github.com/i-richardwang/animate-blog/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/i-richardwang/animate-blog?style=for-the-badge"></a>
<a href="https://twitter.com/richard2wang"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/richard2wang?style=for-the-badge&logo=x"></a>
<a href="https://github.com/i-richardwang/animate-blog/blob/main/LICENSE.md"><img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge"></a>

</div>

![hero](https://richardwang.me/og-image.png)

A single Next.js app built with [Fumadocs](https://fumadocs.dev), Tailwind CSS, [Motion](https://motion.dev) and components from [Animate UI](https://animate-ui.com). The story of how it started is in [Building a personal site with Animate UI](https://richardwang.me/blog/building-personal-site-with-animate-ui).

## Sections

| Route          | Content               | Source             |
| -------------- | --------------------- | ------------------ |
| `/blog`        | Articles              | `content/blogs`    |
| `/docs`        | Notes, by topic       | `content/docs`     |
| `/projects`    | Projects              | `content/projects` |
| `/reading`     | Reading notes         | `content/reading`  |
| `/podcasts`    | Podcast notes         | `content/podcasts` |
| `/status`      | Homelab uptime        | Uptime Kuma        |
| `/token-usage` | AI token usage & cost | Postgres           |

Each content folder is an MDX collection; `source.config.ts` defines the frontmatter it takes, and `meta.json` files order the pages and the notes sidebar. Site name, URL and social links live in `lib/site.ts`. The site also serves `/rss.xml`, `/llms-full.txt`, and the raw MDX of any note at `/docs/<path>.mdx`.

## Development

```bash
pnpm install
pnpm dev
```

| Script                         | What it does                                       |
| ------------------------------ | -------------------------------------------------- |
| `pnpm build` / `pnpm start`    | Production build and server                        |
| `pnpm lint`                    | ESLint; any warning fails                          |
| `pnpm typecheck`               | TypeScript without emitting                        |
| `pnpm format` / `format:check` | Prettier over the code (MDX content is left alone) |
| `pnpm lint:links`              | Checks internal links in the MDX content           |

Commits follow Conventional Commits (checked by commitlint), and `git push` runs lint, the format check and a build first.

## Layout

```
app/          routes, OG image routes, RSS, search and data APIs
components/   site components; components/ui holds shadcn primitives
components/animate-ui/
              Animate UI code installed by the shadcn CLI
content/      MDX content
hooks/, lib/  shared hooks and helpers
```

## Animate UI components

Animate UI is distributed as source through the shadcn CLI rather than as a package. Add a component with:

```bash
pnpm dlx shadcn@latest add @animate-ui/components-buttons-button
```

`components.json` points the CLI at this layout, so files land in `components/animate-ui`, `hooks` and `lib`. Code installed this way is kept as upstream ships it; ESLint only relaxes the React Compiler rules for it.

## Environment

Copy `.env.example` to `.env.local`. The site builds and runs without them; each only affects the feature listed with it:

| Variable                                                   | Used by                                        |
| ---------------------------------------------------------- | ---------------------------------------------- |
| `UPTIME_KUMA_URL`, `UPTIME_KUMA_SLUG`                      | `/status`; defaults to the homelab instance    |
| `CCUSAGE_DATABASE_URL`, `LLMETER_DATABASE_URL`             | `/token-usage`; it shows an error without them |
| `NEXT_PUBLIC_UMAMI_SCRIPT`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami analytics; unset means no script         |

## Credits

Started from the [Animate UI](https://animate-ui.com) docs site by the Animate UI team.

## License

Licensed under the [MIT license](https://github.com/i-richardwang/animate-blog/blob/main/LICENSE.md).
