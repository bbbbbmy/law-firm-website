'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface BannerFormData {
  imageUrl: string
  overlayTextZh: string
  overlayTextEn: string
  sortOrder: number
}

interface BannerFormClientProps {
  initialData?: {
    id: string
    imageUrl: string
    overlayTextZh: string | null
    overlayTextEn: string | null
    sortOrder: number
  }
  mode: 'new' | 'edit'
}

export default function BannerFormClient({ initialData, mode }: BannerFormClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<BannerFormData>({
    imageUrl: initialData?.imageUrl ?? '',
    overlayTextZh: initialData?.overlayTextZh ?? '',
    overlayTextEn: initialData?.overlayTextEn ?? '',
    sortOrder: initialData?.sortOrder ?? 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = mode === 'new'
        ? '/api/admin/banners'
        : `/api/admin/banners/${initialData?.id}`

      const method = mode === 'new' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '保存失败')
      }

      router.push('/admin/banners')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'new' ? '添加Banner' : '编辑Banner'}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {form.imageUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">预览</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={form.imageUrl}
                alt="Banner preview"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">中文文案</label>
          <input
            type="text"
            value={form.overlayTextZh}
            onChange={(e) => setForm({ ...form, overlayTextZh: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">英文文案</label>
          <input
            type="text"
            value={form.overlayTextEn}
            onChange={(e) => setForm({ ...form, overlayTextEn: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}