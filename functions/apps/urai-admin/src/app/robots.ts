import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/features', '/pricing', '/security', '/docs', '/contact', '/privacy', '/terms', '/login'],
        disallow: ['/admin', '/admin/', '/admin/*', '/api/admin', '/api/admin/*'],
      },
    ],
    sitemap: 'https://uraiadmin.com/sitemap.xml',
    host: 'https://uraiadmin.com',
  };
}
