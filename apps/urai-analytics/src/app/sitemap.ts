import type { MetadataRoute } from 'next';

const baseUrl = 'https://uraianalytics.com';
const publicRoutes = ['', '/product', '/pricing', '/enterprise', '/demo', '/docs', '/api-docs', '/security', '/privacy', '/terms', '/contact', '/accessibility'];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.6,
  }));
}
