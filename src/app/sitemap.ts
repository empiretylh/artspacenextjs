import { env } from '@/config/env'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const date = new Date();
  return [
    {
      url: env.APP_URL,
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: env.APP_URL + '/sign-in',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: env.APP_URL + '/sign-up',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: env.APP_URL + '/artworks',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: env.APP_URL + '/artists',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: env.APP_URL + '/galleries',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: env.APP_URL + '/collectors',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: env.APP_URL + '/arcade',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
    {
      url: env.APP_URL + '/events',
      lastModified: date,
      // changeFrequency: 'yearly',
      // priority: 1,
    },
  ]
}
