import { PageLayout, HeroBanner } from '@/components/layout'
import { ArticleList, ExpandableSection } from '@/components/blocks'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Language } from '@/types'

// 服务领域页面查询 practiceArea + article，运行时渲染
export const dynamic = 'force-dynamic'

interface ServicesPageProps {
  params: Promise<{ lang: string }>
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params
  const language = lang as Language

  // Fetch practice areas and case articles from database
  const [practiceAreas, cases] = await Promise.all([
    prisma.practiceArea.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.article.findMany({
      where: { type: 'case', language },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
  ])

  return (
    <PageLayout lang={language}>
      <HeroBanner
        title={language === 'zh' ? '服务领域' : 'Services'}
        backgroundImageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920"
      />

      {/* Practice Areas - Dynamic from database */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="w-12 h-1 bg-gold-500 mb-4" />
            <h2 className="text-3xl font-bold text-navy-900">
              {language === 'zh' ? '业务领域' : 'Practice Areas'}
            </h2>
          </div>

          {practiceAreas.length === 0 ? (
            <div className="text-center py-12 text-navy-400">
              {language === 'zh' ? '暂无业务领域' : 'No practice areas available'}
            </div>
          ) : (
            <div className="space-y-4">
              {practiceAreas.map((area) => (
                <ExpandableSection
                  key={area.id}
                  title={language === 'zh' ? area.titleZh : area.titleEn}
                  defaultExpanded={false}
                >
                  <div className="space-y-4">
                    <p className="text-navy-600 leading-relaxed">
                      {language === 'zh' ? area.descZh : area.descEn}
                    </p>
                    {area.articleSlug && (
                      <Link
                        href={`/${lang}/cases/${area.articleSlug}`}
                        className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium"
                      >
                        {language === 'zh' ? '查看相关案例 →' : 'View Related Cases →'}
                      </Link>
                    )}
                  </div>
                </ExpandableSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Cases - from database */}
      <section className="py-16 bg-navy-50/30">
        <ArticleList
          articles={cases.map(a => ({
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
          title={language === 'zh' ? '相关案例' : 'Related Cases'}
          viewMoreHref="/cases"
        />
      </section>
    </PageLayout>
  )
}