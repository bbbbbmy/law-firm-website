'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import RichTextEditor from './RichTextEditor'

interface ArticleFormData {
  slug: string
  type: 'news' | 'case'
  // Chinese version
  titleZh: string
  summaryZh: string
  contentZh: string
  // English version
  titleEn: string
  summaryEn: string
  contentEn: string
  // Common fields
  coverImageUrl: string
  author: string
  publishedAt: string
}

interface BilingualArticleFormProps {
  initialData?: {
    id: string
    slug: string
    type: 'news' | 'case'
    // Chinese version
    titleZh: string | null
    summaryZh: string | null
    contentZh: string | null
    // English version
    titleEn: string | null
    summaryEn: string | null
    contentEn: string | null
    // Common fields
    coverImageUrl: string | null
    author: string | null
    publishedAt: string | null
  }
  mode: 'new' | 'edit'
}

export default function BilingualArticleForm({ initialData, mode }: BilingualArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh')

  const [form, setForm] = useState<ArticleFormData>({
    slug: initialData?.slug ?? '',
    type: initialData?.type ?? 'news',
    titleZh: initialData?.titleZh ?? '',
    summaryZh: initialData?.summaryZh ?? '',
    contentZh: initialData?.contentZh ?? '',
    titleEn: initialData?.titleEn ?? '',
    summaryEn: initialData?.summaryEn ?? '',
    contentEn: initialData?.contentEn ?? '',
    coverImageUrl: initialData?.coverImageUrl ?? '',
    author: initialData?.author ?? '',
    publishedAt: initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().split('T')[0]
      : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate at least one language has content
      if (!form.titleZh.trim() && !form.titleEn.trim()) {
        throw new Error('至少需要填写一种语言的标题')
      }

      const url = mode === 'new'
        ? '/api/admin/articles/bilingual'
        : `/api/admin/articles/bilingual/${initialData?.id}`

      const method = mode === 'new' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: form.slug || form.titleZh.toLowerCase().replace(/\s+/g, '-') || form.titleEn.toLowerCase().replace(/\s+/g, '-'),
          type: form.type,
          titleZh: form.titleZh || null,
          summaryZh: form.summaryZh || null,
          contentZh: form.contentZh || null,
          titleEn: form.titleEn || null,
          summaryEn: form.summaryEn || null,
          contentEn: form.contentEn || null,
          coverImageUrl: form.coverImageUrl || null,
          author: form.author || null,
          publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '保存失败')
      }

      router.push('/admin/articles')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'new' ? '新建文章' : '编辑文章'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          同时编辑中英文版本，共享相同的Slug
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
        {/* Language Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              type="button"
              onClick={() => setActiveTab('zh')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'zh'
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              �🇷 中文内容
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'en'
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🇬🇧 English Content
            </button>
          </nav>
        </div>

        <div className="p-6 space-y-6">
          {/* Cover Image - Common Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
            <input
              type="url"
              value={form.coverImageUrl}
              onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            {form.coverImageUrl && (
              <div className="mt-2">
                <img
                  src={form.coverImageUrl}
                  alt="Cover preview"
                  className="h-40 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Common Fields - always visible */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (共用)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated-from-title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'news' | 'case' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="news">资讯</option>
                <option value="case">案例</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">发布日期</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          {/* Chinese Content Section */}
          {activeTab === 'zh' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  中文标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.titleZh}
                  onChange={(e) => setForm({ ...form, titleZh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">中文摘要</label>
                <textarea
                  rows={2}
                  value={form.summaryZh}
                  onChange={(e) => setForm({ ...form, summaryZh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">中文内容</label>
                <RichTextEditor
                  value={form.contentZh}
                  onChange={(value) => setForm({ ...form, contentZh: value })}
                  placeholder="输入文章内容..."
                />
              </div>
            </div>
          )}

          {/* English Content Section */}
          {activeTab === 'en' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Summary</label>
                <textarea
                  rows={2}
                  value={form.summaryEn}
                  onChange={(e) => setForm({ ...form, summaryEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Content</label>
                <RichTextEditor
                  value={form.contentEn}
                  onChange={(value) => setForm({ ...form, contentEn: value })}
                  placeholder="Enter article content..."
                />
              </div>
            </div>
          )}

          {/* Quick preview of both languages */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">内容预览</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-500 mb-1">中文标题:</div>
                <div className="text-gray-900">{form.titleZh || '(未填写)'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-500 mb-1">English Title:</div>
                <div className="text-gray-900">{form.titleEn || '(Not filled)'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
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