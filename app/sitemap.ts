import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // Ganti URL dengan domain production Anda nanti
  const baseUrl = 'https://domainanda.com'

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
