import { SITE } from '@/lib/site';

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description:
        'A personal blog and knowledge base for learning, exploration, and sharing insights.',
      inLanguage: 'en',
      publisher: {
        '@id': `${SITE.url}/#organization`,
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.url}/icon-logo.png`,
        width: 512,
        height: 512,
      },
    },
  ],
};
