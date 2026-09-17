'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientBasePath } from '@/lib/clientBasePath'

interface Section {
  id: string
  title: string
  content: string
}

interface PageContent {
  title: string
  pageTitle: string
  breadcrumb: string
  sections: Section[]
}

interface Props {
  initialContent: { zh: PageContent; en: PageContent }
}

// 每个 section id 对应的中文标签，给后台用
const SECTION_LABELS: Record<string, string> = {
  intro:   '律所简介',
  honors:  '荣誉资质',
  clients: '德善客户',
}

export default function AboutPageClient({ initialContent }: Props) {
  const router = useRouter()
  const [lang, setLang] = useState<'zh' | 'en'>('zh')
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const update = (patch: Partial<PageContent>) => {
    setContent((prev) => ({ ...prev, [lang]: { ...prev[lang], ...patch } }))
  }

  const updateSection = (idx: number, patch: Partial<Section>) => {
    setContent((prev) => {
      const langContent = prev[lang]
      const sections = langContent.sections.map((s, i) => (i === idx ? { ...s, ...patch } : s))
      return { ...prev, [lang]: { ...langContent, sections } }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const langContent = content[lang]
      const res = await fetch(`${clientBasePath()}/api/admin/pages/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          title: langContent.title,
          // PageContent 是一个嵌套对象，DB 端 PageContent.content 是 JSON 字符串
          content: JSON.stringify(langContent),
        }),
      })
      if (!res.ok) throw new Error('保存失败')
      setMessage(`${lang === 'zh' ? '中文' : 'English'} 版本保存成功`)
      router.refresh()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const langContent = content[lang]
  const SECTION_DESCRIPTIONS: Record<string, string> = {
    intro:   '在「关于我们」页面右栏显示的第一段。介绍律所背景、团队、擅长领域。',
    honors:  lang === 'zh' ? '荣誉资质 section 的内容。支持换行（直接换行即可）。' : 'Honors section. Plain text; newlines preserved.',
    clients: lang === 'zh' ? '德善客户 section 的内容，列出客户类型或名称。' : 'Clients section.',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">关于我们页面内容</h1>
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

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Page-level fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              页面标题 (HeroBanner 用)
            </label>
            <input
              type="text"
              value={langContent.title}
              onChange={(e) => update({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              侧栏标题
            </label>
            <input
              type="text"
              value={langContent.pageTitle}
              onChange={(e) => update({ pageTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              面包屑链接文字
            </label>
            <input
              type="text"
              value={langContent.breadcrumb}
              onChange={(e) => update({ breadcrumb: e.target.value })}
              placeholder={lang === 'zh' ? '例如：返回首页' : 'e.g. Back to Home'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Sections */}
        {langContent.sections.map((section, idx) => (
          <div key={section.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-gray-900">
                {SECTION_LABELS[section.id] || section.id}
                <span className="ml-2 text-xs text-gray-400 font-mono">#{section.id}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">{SECTION_DESCRIPTIONS[section.id]}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">section 标题</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(idx, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">section 正文</label>
                <textarea
                  rows={8}
                  value={section.content}
                  onChange={(e) => updateSection(idx, { content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  支持纯文本换行（页面里用 <code className="bg-gray-100 px-1 rounded">whitespace-pre-line</code> 渲染）
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            保存的是当前 tab 的语言。两个语言版本互不影响，需分别保存。
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : `保存${lang === 'zh' ? '中文' : 'English'}版本`}
          </button>
        </div>
      </div>
    </div>
  )
}
