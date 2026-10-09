import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.deshanxinyi.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'], // 后台和 admin API 别让爬虫进
      },
    ],
    sitemap: `${SITE_URL}/lawfirm/sitemap.xml`,
    host: SITE_URL,
  }
}
