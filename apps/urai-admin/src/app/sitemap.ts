import type { MetadataRoute } from 'next';

/**
 * URAI Admin is intentionally noindex/nofollow across both its public gate and
 * protected operator surface. An empty sitemap avoids advertising URLs that
 * search engines are explicitly told not to index.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
