import { env } from '@/config/env'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const date = new Date();
  return [
    {
      url: "/",
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: '/sign-in',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: '/sign-up',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: '/artworks',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: '/artists',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: '/galleries',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: '/collectors',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: '/arcade',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: '/events',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
  ]
}
