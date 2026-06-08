'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SiteConfig {
  key: string
  value: string | null
  language: string | null
}

interface SettingsClientProps {
  configs: SiteConfig[]
}

export default function SettingsClient({ configs }: SettingsClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const getConfig = (key: string, lang?: string | null) => {
    return configs.find(c => c.key === key && (lang ? c.language === lang : !c.language))?.value ?? ''
  }

  // Basic info state
  const [basicInfo, setBasicInfo] = useState({
    firmNameZh: getConfig('firm_name', 'zh'),
    firmNameEn: getConfig('firm_name', 'en'),
    address: getConfig('address'),
    phone: getConfig('phone'),
    email: getConfig('email'),
  })

  // About section state
  const [about, setAbout] = useState({
    imageUrl: getConfig('homepage_about_image_url'),
    titleZh: getConfig('homepage_about_title_zh', 'zh'),
    titleEn: getConfig('homepage_about_title_en', 'en'),
    contentZh: getConfig('homepage_about_content_zh', 'zh'),
    contentEn: getConfig('homepage_about_content_en', 'en'),
  })

  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Save firm_name zh
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'firm_name', value: basicInfo.firmNameZh, language: 'zh' }),
      })
      // Save firm_name en
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'firm_name', value: basicInfo.firmNameEn, language: 'en' }),
      })
      // Save address
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'address', value: basicInfo.address }),
      })
      // Save phone
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phone', value: basicInfo.phone }),
      })
      // Save email
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'email', value: basicInfo.email }),
      })

      setMessage('基本信息保存成功')
      router.refresh()
    } catch (error) {
      setMessage('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_image_url', value: about.imageUrl }),
      })
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_title_zh', value: about.titleZh, language: 'zh' }),
      })
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_title_en', value: about.titleEn, language: 'en' }),
      })
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_content_zh', value: about.contentZh, language: 'zh' }),
      })
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_content_en', value: about.contentEn, language: 'en' }),
      })

      setMessage('关于我们设置保存成功')
      router.refresh()
    } catch (error) {
      setMessage('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">网站设置</h1>

      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        <form onSubmit={handleSaveBasicInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                律所名称 (中文)
              </label>
              <input
                type="text"
                value={basicInfo.firmNameZh}
                onChange={(e) => setBasicInfo({ ...basicInfo, firmNameZh: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                律所名称 (英文)
              </label>
              <input
                type="text"
                value={basicInfo.firmNameEn}
                onChange={(e) => setBasicInfo({ ...basicInfo, firmNameEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              联系地址
            </label>
            <input
              type="text"
              value={basicInfo.address}
              onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                联系电话
              </label>
              <input
                type="text"
                value={basicInfo.phone}
                onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                电子邮箱
              </label>
              <input
                type="email"
                value={basicInfo.email}
                onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存设置'}
            </button>
          </div>
        </form>
      </div>

      {/* About Us Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">关于我们 (首页)</h2>
        <form onSubmit={handleSaveAbout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              图片URL
            </label>
            <input
              type="url"
              value={about.imageUrl}
              onChange={(e) => setAbout({ ...about, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {about.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">预览</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden h-48">
                <img src={about.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题 (中文)
              </label>
              <input
                type="text"
                value={about.titleZh}
                onChange={(e) => setAbout({ ...about, titleZh: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题 (英文)
              </label>
              <input
                type="text"
                value={about.titleEn}
                onChange={(e) => setAbout({ ...about, titleEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              内容 (中文)
            </label>
            <textarea
              rows={4}
              value={about.contentZh}
              onChange={(e) => setAbout({ ...about, contentZh: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              内容 (英文)
            </label>
            <textarea
              rows={4}
              value={about.contentEn}
              onChange={(e) => setAbout({ ...about, contentEn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存设置'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">修改密码</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              当前密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              确认新密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            修改密码
          </button>
        </form>
      </div>
    </div>
  )
}