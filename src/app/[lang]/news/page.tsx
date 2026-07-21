import { PageLayout, HeroBanner } from '@/components/layout'
import { ArticleList } from '@/components/blocks'
import { prisma } from '@/lib/prisma'

// 新闻列表依赖数据库，运行时渲染
export const dynamic = 'force-dynamic'

interface NewsPageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ search?: string }>
}

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const { lang } = await params
  const { search } = await searchParams
  const language = lang === 'zh' ? 'zh' : 'en'

  const articles = await prisma.article.findMany({
    where: {
      type: 'news',
      language,
      ...(search ? {
        OR: [
          { title: { contains: search } },
          { summary: { contains: search } },
          { content: { contains: search } },
        ]
      } : {}),
    },
    orderBy: { publishedAt: 'desc' },
  })

  const pageTitle = search
    ? (language === 'zh' ? `搜索: "${search}"` : `Search: "${search}"`)
    : (language === 'zh' ? '资讯动态' : 'News')

  return (
    <PageLayout lang={language}>
      <HeroBanner
        title={pageTitle}
        backgroundImageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920"
      />

      <ArticleList
        articles={articles.map(a => ({
          id: a.id,
          slug: a.slug,
          type: a.type as 'news' | 'case',
          language: a.language as 'zh' | 'en',
          title: a.title,
          summary: a.summary,
          content: a.content,
          coverImageUrl: a.coverImageUrl,
          author: a.author,
          publishedAt: a.publishedAt,
        }))}
        lang={language}
      />
    </PageLayout>
  )
}