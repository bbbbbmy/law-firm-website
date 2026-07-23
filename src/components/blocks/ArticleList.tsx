'use client'

import Link from 'next/link'
import type { ArticleData, Language } from '@/types'
import { buildHref } from '@/lib/url'

interface ArticleListProps {
  articles: ArticleData[]
  lang: Language
  title?: string
  viewMoreHref?: string
}

export default function ArticleList({ articles, lang, title, viewMoreHref }: ArticleListProps) {
  return (
    <div className="py-16 bg-navy-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="w-12 h-1 bg-gold-500 mb-4" />
              <h2 className="text-3xl font-bold text-navy-900">{title}</h2>
            </div>
            {viewMoreHref && (
              <Link
                href={buildHref(viewMoreHref, lang)}
                className="text-gold-600 hover:text-gold-700 font-medium flex items-center group"
              >
                {lang === 'zh' ? '查看更多' : 'View More'}
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={buildHref(`/${article.type === 'news' ? 'news' : 'cases'}/${article.slug}`, lang)}
              className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gold-300"
            >
              {/* Image */}
              {article.coverImageUrl ? (
                <div className="aspect-video bg-gradient-to-br from-navy-100 to-navy-200 overflow-hidden">
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              ) : article.content ? (
                <div className="aspect-video bg-gradient-to-br from-navy-100 to-navy-200 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-navy-300 text-5xl font-serif font-bold">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    article.type === 'news'
                      ? 'bg-gold-100 text-gold-700'
                      : 'bg-navy-100 text-navy-700'
                  }`}>
                    {article.type === 'news'
                      ? (lang === 'zh' ? '资讯' : 'News')
                      : (lang === 'zh' ? '案例' : 'Case')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-navy-900 group-hover:text-gold-600 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-navy-600 text-sm line-clamp-2 mb-4">
                    {article.summary}
                  </p>
                )}
                {article.publishedAt && (
                  <p className="text-navy-400 text-xs">
                    {new Date(article.publishedAt).toLocaleDateString(
                      lang === 'zh' ? 'zh-CN' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-center text-navy-400 py-12">
            {lang === 'zh' ? '暂无内容' : 'No content available'}
          </p>
        )}
      </div>
    </div>
  )
}