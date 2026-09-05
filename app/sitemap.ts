import { MetadataRoute } from 'next'
import { getAppUrl } from '@/lib/url'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl()

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // Anda bisa tambahkan URL halaman statis lainnya di sini, contoh:
    // {
    //   url: `${baseUrl}/pricing`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ]
}
