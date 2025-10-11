export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://richardwang.me/#website',
      url: 'https://richardwang.me',
      name: "John Doe's Page",
      description:
        'A personal blog and knowledge base for learning, exploration, and sharing insights.',
      inLanguage: 'en',
      publisher: {
        '@id': 'https://richardwang.me/#organization',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://richardwang.me/#organization',
      name: "John Doe's Page",
      url: 'https://richardwang.me',
      logo: {
        '@type': 'ImageObject',
        url: 'https://richardwang.me/icon-logo.png',
        width: 512,
        height: 512,
      },
    },
  ],
};
