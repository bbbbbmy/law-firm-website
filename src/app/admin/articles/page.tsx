import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  type: string
  language: string
  summary: string | null
  publishedAt: Date | null
  createdAt: Date
}

export default async function ArticlesPage() {
  const articles: Article[] = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  }) as Article[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
        <Link
          href="/admin/articles/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          新建文章
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                语言
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                发布日期
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  暂无文章，<Link href="/admin/articles/new" className="text-primary-600 hover:underline">点击新建</Link>
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-gray-900 hover:text-primary-600"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        article.type === 'news'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {article.type === 'news' ? '资讯' : '案例'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.language === 'zh' ? '中文' : '英文'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString('zh-CN')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-primary-600 hover:text-primary-700 mr-4"
                    >
                      编辑
                    </Link>
                    <form action={`/api/admin/articles/${article.id}?/delete`} method="POST" className="inline">
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          if (!confirm('确定要删除这篇文章吗？')) {
                            e.preventDefault()
                          }
                        }}
                      >
                        删除
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}