import type { MetadataRoute } from 'next';

const baseUrl = 'https://uraiadmin.com';

const publicRoutes = [
  '',
  '/features',
  '/pricing',
  '/security',
  '/docs',
  '/contact',
  '/privacy',
  '/terms',
  '/login',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/features' || route === '/pricing' ? 0.8 : 0.5,
  }));
}
