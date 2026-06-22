import { PageLayout, HeroBanner } from '@/components/layout'
import { ArticleList } from '@/components/blocks'
import { prisma } from '@/lib/prisma'

interface CasesPageProps {
  params: Promise<{ lang: string }>
}

export default async function CasesPage({ params }: CasesPageProps) {
  const { lang } = await params
  const language = lang === 'zh' ? 'zh' : 'en'

  const articles = await prisma.article.findMany({
    where: {
      type: 'case',
      language,
    },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <PageLayout lang={language}>
      <HeroBanner
        title={language === 'zh' ? '案例展示' : 'Cases'}
        backgroundImageUrl="https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=1920"
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