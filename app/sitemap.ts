import { MetadataRoute } from 'next'
import { getAppUrl } from '@/lib/url'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/solusi/retail`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/solusi/fnb`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/solusi/jasa`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/solusi/rental`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/comparison`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  return staticPages
}
