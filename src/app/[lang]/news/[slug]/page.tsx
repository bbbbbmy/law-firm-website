import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/layout'
import type { Language } from '@/types'

interface ArticlePageProps {
  params: Promise<{ lang: string; slug: string }>
}

export default async function NewsArticlePage({ params }: ArticlePageProps) {
  const { lang, slug: encodedSlug } = await params
  const language = lang as Language
  const slug = decodeURIComponent(encodedSlug)

  const article = await prisma.article.findFirst({
    where: {
      slug,
      type: 'news',
      language,
    },
  })

  if (!article) {
    notFound()
  }

  return (
    <PageLayout lang={language}>
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cover Image */}
          {article.coverImageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <div className="text-sm text-gray-500 mb-2">
              {lang === 'zh' ? '资讯' : 'News'}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            {article.publishedAt && (
              <p className="text-gray-400">
                {new Date(article.publishedAt).toLocaleDateString(
                  lang === 'zh' ? 'zh-CN' : 'en-US'
                )}
              </p>
            )}
            {article.author && (
              <p className="text-gray-500 mt-2">
                {lang === 'zh' ? '作者：' : 'Author: '}{article.author}
              </p>
            )}
          </header>

          {article.summary && (
            <div className="text-lg text-gray-600 mb-8 pb-8 border-b">
              {article.summary}
            </div>
          )}

          {article.content ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-gray-500">
              {lang === 'zh' ? '暂无正文内容' : 'No content available'}
            </p>
          )}

          <div className="mt-16 pt-8 border-t">
            <a
              href={`/lawfirm/${lang}/news`}
              className="text-gold-600 hover:text-gold-700"
            >
              ← {lang === 'zh' ? '返回资讯列表' : 'Back to News'}
            </a>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}