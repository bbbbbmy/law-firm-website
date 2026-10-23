'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientBasePath } from '@/lib/clientBasePath'
import type { CareersCardData, CareersContentData, CareersJobData } from '@/lib/careersContent'
import type { Language } from '@/types'

interface LanguageBundle {
  content: CareersContentData
  cards: CareersCardData[]
  jobs: CareersJobData[]
}

interface Props {
  initialContent: Record<Language, LanguageBundle>
}

type ContentKey = Exclude<keyof CareersContentData, 'language'>

interface FieldDef {
  key: ContentKey
  label: string
  rows?: number
  hint?: string
}

// 正文区块的字段顺序 = 页面上从上到下的顺序
const TEXT_FIELDS: FieldDef[] = [
  { key: 'bannerTitle', label: 'Banner 主标题', hint: '页面最顶部大标题' },
  { key: 'bannerSubtitle', label: 'Banner 副标题', hint: '主标题下方的小字' },
  { key: 'bannerQuote', label: 'Banner 底部引语' },
  { key: 'introTitle', label: '开篇引言标题' },
  { key: 'introContent', label: '开篇引言正文', rows: 6 },
  { key: 'environmentTitle', label: '板块1 标题（优渥环境）' },
  { key: 'environmentLabel', label: '板块1 英文小字', hint: '如 ENVIRONMENT' },
  { key: 'environmentContent', label: '板块1 正文', rows: 10, hint: '空一行分段' },
  { key: 'environmentImageUrl', label: '板块1 配图 URL', hint: '留空则显示品牌色渐变块；也可在下方上传' },
  { key: 'supportTitle', label: '板块2 标题（重磅扶持）' },
  { key: 'supportLabel', label: '板块2 英文小字', hint: '如 SUPPORT' },
  { key: 'supportLead', label: '板块2 前置引导段', rows: 5 },
  { key: 'creationTitle', label: '板块3 标题（初心如磐）' },
  { key: 'creationLabel', label: '板块3 英文小字', hint: '如 CREATION' },
  { key: 'creationContent', label: '板块3 正文', rows: 12, hint: '空一行分段' },
  { key: 'invitationTitle', label: '板块4 标题（招募邀约）' },
  { key: 'invitationLabel', label: '板块4 英文小字', hint: '如 INVITATION' },
  { key: 'invitationContent', label: '板块4 正文', rows: 6 },
  { key: 'jobsTitle', label: '板块5 标题（热招岗位）' },
  { key: 'contactTitle', label: '底部联系区标题' },
]

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'

export default function CareersPageClient({ initialContent }: Props) {
  const router = useRouter()
  const [lang, setLang] = useState<Language>('zh')
  const [bundle, setBundle] = useState<Record<Language, LanguageBundle>>(initialContent)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const current = bundle[lang]
  const isEn = lang === 'en'

  const updateField = (key: ContentKey, value: string) => {
    setBundle(prev => ({
      ...prev,
      [lang]: { ...prev[lang], content: { ...prev[lang].content, [key]: value } },
    }))
  }

  const updateCard = (idx: number, patch: Partial<CareersCardData>) => {
    setBundle(prev => {
      const cards = prev[lang].cards.map((c, i) => (i === idx ? { ...c, ...patch } : c))
      return { ...prev, [lang]: { ...prev[lang], cards } }
    })
  }

  const updateJob = (idx: number, patch: Partial<CareersJobData>) => {
    setBundle(prev => {
      const jobs = prev[lang].jobs.map((j, i) => (i === idx ? { ...j, ...patch } : j))
      return { ...prev, [lang]: { ...prev[lang], jobs } }
    })
  }

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onDone: (url: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading('image')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'media')
      const res = await fetch(`${clientBasePath()}/api/upload`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('上传失败')
      const result = await res.json()
      onDone(result.url)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`${clientBasePath()}/api/admin/careers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...current.content,
          cards: current.cards.map(({ title, content, sortOrder }) => ({ title, content, sortOrder })),
          jobs: current.jobs.map(({ title, tags, requirements, duties, photoUrl, sortOrder }) => ({
            title,
            tags,
            requirements,
            duties,
            photoUrl,
            sortOrder,
          })),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || '保存失败')
      }
      setMessage(isEn ? 'English version saved' : '中文版本保存成功')
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">加入我们页面内容</h1>
        <div className="flex rounded-md border border-gray-300 overflow-hidden">
          <button
            type="button"
            onClick={() => setLang('zh')}
            className={`px-4 py-2 text-sm ${lang === 'zh' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            中文
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-4 py-2 text-sm ${lang === 'en' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            English
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg border ${
          message.includes('失败')
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* 正文文案 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-gray-900 mb-4 pb-3 border-b">
          页面文案（{isEn ? 'English' : '中文'}）
        </h2>
        <div className="space-y-4">
          {TEXT_FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              {f.rows ? (
                <textarea
                  rows={f.rows}
                  value={current.content[f.key] ?? ''}
                  onChange={e => updateField(f.key, e.target.value)}
                  className={inputClass}
                />
              ) : (
                <input
                  type="text"
                  value={current.content[f.key] ?? ''}
                  onChange={e => updateField(f.key, e.target.value)}
                  className={inputClass}
                />
              )}
              {f.hint && <p className="mt-1 text-xs text-gray-500">{f.hint}</p>}
            </div>
          ))}
        </div>

        {/* 板块1 配图上传 */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {isEn ? 'Environment section image' : '板块1 配图上传'}
          </p>
          <input
            type="file"
            accept="image/*"
            id="careers-env-image"
            className="hidden"
            onChange={e => handleUpload(e, url => updateField('environmentImageUrl', url))}
          />
          <label
            htmlFor="careers-env-image"
            className="inline-block px-4 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
          >
            {uploading === 'image' ? '上传中...' : isEn ? 'Choose Image' : '选择图片'}
          </label>
          {current.content.environmentImageUrl && (
            <img
              src={current.content.environmentImageUrl}
              alt="environment"
              className="mt-3 w-48 h-32 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>
      </div>

      {/* 板块2 扶持卡片 */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-gray-900 mb-4 pb-3 border-b">
          {isEn ? 'Support cards (3)' : '板块2 扶持卡片（3 张）'}
        </h2>
        <div className="space-y-4">
          {current.cards.map((card, idx) => (
            <div key={card.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">卡片标题</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={e => updateCard(idx, { title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">卡片正文</label>
                  <textarea
                    rows={5}
                    value={card.content}
                    onChange={e => updateCard(idx, { content: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 板块5 岗位卡片 */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-gray-900 mb-4 pb-3 border-b">
          {isEn ? 'Job cards' : '板块5 岗位卡片'}
        </h2>
        <div className="space-y-4">
          {current.jobs.map((job, idx) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">岗位名称</label>
                  <input
                    type="text"
                    value={job.title}
                    onChange={e => updateJob(idx, { title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    岗位标签（用 ｜ 分隔）
                  </label>
                  <input
                    type="text"
                    value={job.tags}
                    onChange={e => updateJob(idx, { tags: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">任职要求</label>
                  <textarea
                    rows={4}
                    value={job.requirements}
                    onChange={e => updateJob(idx, { requirements: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    岗位职责（没有就留空）
                  </label>
                  <textarea
                    rows={4}
                    value={job.duties}
                    onChange={e => updateJob(idx, { duties: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">岗位照片 URL</label>
                  <input
                    type="text"
                    value={job.photoUrl ?? ''}
                    onChange={e => updateJob(idx, { photoUrl: e.target.value || null })}
                    className={inputClass}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id={`careers-job-${idx}`}
                    className="hidden"
                    onChange={e => handleUpload(e, url => updateJob(idx, { photoUrl: url }))}
                  />
                  <label
                    htmlFor={`careers-job-${idx}`}
                    className="mt-2 inline-block px-3 py-1.5 border border-gray-300 rounded-md text-xs cursor-pointer hover:bg-gray-50"
                  >
                    {uploading === 'image' ? '上传中...' : '上传照片'}
                  </label>
                  {job.photoUrl && (
                    <img
                      src={job.photoUrl}
                      alt={job.title}
                      className="mt-2 w-40 h-28 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          保存的是当前 tab 的语言，两个语言版本互不影响，需分别保存。
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {saving ? '保存中...' : `保存${isEn ? 'English' : '中文'}版本`}
        </button>
      </div>
    </div>
  )
}