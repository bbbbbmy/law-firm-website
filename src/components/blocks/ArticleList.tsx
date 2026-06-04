import Link from 'next/link'
import type { ArticleData, Language } from '@/types'

interface ArticleListProps {
  articles: ArticleData[]
  lang: Language
  title?: string
  viewMoreHref?: string
}

export default function ArticleList({ articles, lang, title, viewMoreHref }: ArticleListProps) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {viewMoreHref && (
              <Link
                href={`/${lang}${viewMoreHref}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {lang === 'zh' ? '查看更多 →' : 'View More →'}
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/${lang}/${article.type === 'news' ? 'news' : 'cases'}/${article.slug}`}
              className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {article.content && (
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-primary-400 text-4xl">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {article.summary}
                  </p>
                )}
                {article.publishedAt && (
                  <p className="text-gray-400 text-xs mt-4">
                    {new Date(article.publishedAt).toLocaleDateString(
                      lang === 'zh' ? 'zh-CN' : 'en-US'
                    )}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            {lang === 'zh' ? '暂无内容' : 'No content available'}
          </p>
        )}
      </div>
    </div>
  )
}