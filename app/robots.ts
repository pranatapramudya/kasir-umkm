import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/superadmin', '/onboarding'],
    },
    // sitemap: 'https://domainanda.com/sitemap.xml', // Uncomment and replace with your actual domain when deploying
  }
}
