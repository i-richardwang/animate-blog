# Personal Blog Template

This is the main web application for the personal blog template.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
apps/www/
├── app/                 # Next.js app directory
├── components/          # React components
├── content/             # MDX content (docs & blogs)
├── lib/                 # Utility functions
├── registry/            # Animate UI components
└── public/              # Static assets
```

## Content Management

- **Docs**: Add MDX files to `/content/docs/`
- **Blog**: Add MDX files to `/content/blogs/`
- **Navigation**: Update `/content/docs/meta.json` files

## Built With

- [Next.js 15](https://nextjs.org/)
- [Animate UI](https://animate-ui.com)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motion](https://motion.dev/)
- [Fumadocs](https://fumadocs.vercel.app/)

For the complete customization guide, see the main [README.md](../../README.md).
