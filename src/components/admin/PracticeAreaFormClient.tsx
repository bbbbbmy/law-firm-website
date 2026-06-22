'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ArticleOption {
  id: string
  slug: string
  title: string
  language: string
}

interface PracticeAreaFormData {
  imageUrl: string
  titleZh: string
  titleEn: string
  descZh: string
  descEn: string
  articleSlug: string
  sortOrder: number
}

interface PracticeAreaFormClientProps {
  initialData?: {
    id: string
    imageUrl: string
    titleZh: string
    titleEn: string
    descZh: string | null
    descEn: string | null
    articleSlug: string | null
    sortOrder: number
  }
  mode: 'new' | 'edit'
}

export default function PracticeAreaFormClient({ initialData, mode }: PracticeAreaFormClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [articles, setArticles] = useState<ArticleOption[]>([])
  const [loadingArticles, setLoadingArticles] = useState(true)

  const [form, setForm] = useState<PracticeAreaFormData>({
    imageUrl: initialData?.imageUrl ?? '',
    titleZh: initialData?.titleZh ?? '',
    titleEn: initialData?.titleEn ?? '',
    descZh: initialData?.descZh ?? '',
    descEn: initialData?.descEn ?? '',
    articleSlug: initialData?.articleSlug ?? '',
    sortOrder: initialData?.sortOrder ?? 0,
  })

  // Fetch articles (cases) for selection
  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/admin/articles?type=case')
        if (res.ok) {
          const data = await res.json()
          setArticles(data.map((a: any) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            language: a.language,
          })))
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err)
      } finally {
        setLoadingArticles(false)
      }
    }
    fetchArticles()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = mode === 'new'
        ? '/api/admin/practice-areas'
        : `/api/admin/practice-areas/${initialData?.id}`

      const method = mode === 'new' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          articleSlug: form.articleSlug || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '保存失败')
      }

      router.push('/admin/practice-areas')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setLoading(false)
    }
  }

  // Group articles by language
  const zhArticles = articles.filter(a => a.language === 'zh')
  const enArticles = articles.filter(a => a.language === 'en')

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'new' ? '添加业务领域' : '编辑业务领域'}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
          <input
            type="url"
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        {form.imageUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">预览</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden h-48">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">中文标题</label>
            <input
              type="text"
              required
              value={form.titleZh}
              onChange={(e) => setForm({ ...form, titleZh: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">英文标题</label>
            <input
              type="text"
              required
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">中文描述</label>
          <textarea
            rows={3}
            value={form.descZh}
            onChange={(e) => setForm({ ...form, descZh: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">英文描述</label>
          <textarea
            rows={3}
            value={form.descEn}
            onChange={(e) => setForm({ ...form, descEn: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            关联文章（可选）
          </label>
          <p className="text-xs text-gray-500 mb-2">
            选择后点击业务领域将跳转到对应的案例文章
          </p>
          {loadingArticles ? (
            <div className="px-3 py-2 text-gray-500">加载中...</div>
          ) : (
            <select
              value={form.articleSlug}
              onChange={(e) => setForm({ ...form, articleSlug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">-- 不关联文章 --</option>
              <optgroup label="中文案例">
                {zhArticles.length === 0 && <option disabled>无可用案例</option>}
                {zhArticles.map((article) => (
                  <option key={article.slug} value={article.slug}>
                    {article.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="English Cases">
                {enArticles.length === 0 && <option disabled>No cases available</option>}
                {enArticles.map((article) => (
                  <option key={article.slug} value={article.slug}>
                    {article.title}
                  </option>
                ))}
              </optgroup>
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gold-600 text-white px-6 py-2 rounded-md hover:bg-gold-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}