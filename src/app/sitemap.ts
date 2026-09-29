import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// sitemap 需要查 DB（团队成员、文章），build 阶段 DB 不存在 → 强制运行时渲染
export const dynamic = 'force-dynamic'
export const revalidate = 3600  // 每小时重新生成一次

// 网站对外的绝对 URL（跟 docker/frontend.Dockerfile 里 NEXT_PUBLIC_SITE_URL 一致）
const SITE_URL = 'https://www.deshanxinyi.com'

// 首页/核心页面：zh + en 两个语言版本
const STATIC_PAGES = [
  '',         // /lawfirm 重定向到 /lawfirm/zh
  '/zh',
  '/en',
  '/zh/about',
  '/en/about',
  '/zh/services',
  '/en/services',
  '/zh/team',
  '/en/team',
  '/zh/news',
  '/en/news',
  '/zh/cases',
  '/en/cases',
  '/zh/contact',
  '/en/contact',
  '/zh/careers',
  '/en/careers',
]

// Sitemap 频率提示（百度/Google 都参考）
const STATIC_CHANGEFREQ: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'
const DYNAMIC_CHANGEFREQ: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 静态页面
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: STATIC_CHANGEFREQ,
    priority: path === '' || path.endsWith('/zh') || path.endsWith('/en') ? 1.0 : 0.8,
  }))

  // 动态页面：团队成员 / 文章 / 案例
  // sitemap 里也必须含路径（不带 basePath），Next.js 会自动加
  const [team, articles] = await Promise.all([
    prisma.teamMember.findMany({ select: { id: true, updatedAt: true } }),
    prisma.article.findMany({ select: { slug: true, language: true, updatedAt: true, type: true } }),
  ])

  const teamEntries: MetadataRoute.Sitemap = team.flatMap((m) => ([
    {
      url: `${SITE_URL}/zh/team/${m.id}`,
      lastModified: m.updatedAt,
      changeFrequency: DYNAMIC_CHANGEFREQ,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/en/team/${m.id}`,
      lastModified: m.updatedAt,
      changeFrequency: DYNAMIC_CHANGEFREQ,
      priority: 0.6,
    },
  ]))

  const articleEntries: MetadataRoute.Sitemap = articles.flatMap((a) => ([
    {
      url: `${SITE_URL}/zh/${a.type === 'news' ? 'news' : 'cases'}/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: DYNAMIC_CHANGEFREQ,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/en/${a.type === 'news' ? 'news' : 'cases'}/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: DYNAMIC_CHANGEFREQ,
      priority: 0.7,
    },
  ]))

  return [...staticEntries, ...teamEntries, ...articleEntries]
}
