import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/product', '/pricing', '/enterprise', '/demo', '/docs', '/api-docs', '/security', '/privacy', '/terms', '/contact', '/accessibility'],
        disallow: ['/app', '/app/', '/app/*', '/login', '/signup', '/api/', '/api/*'],
      },
    ],
    sitemap: 'https://uraianalytics.com/sitemap.xml',
    host: 'https://uraianalytics.com',
  };
}
