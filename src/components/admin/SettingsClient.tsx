'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientBasePath } from '@/lib/clientBasePath'

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

  // Header logo & tagline (both used by Header + Footer, including that
  // small "LAW FIRM" / "律师事务所" yellow caption under the logo).
  // DB keys: header_logo_url, header_tagline_zh, header_tagline_en.
  const [headerLogoUrl, setHeaderLogoUrl] = useState(getConfig('header_logo_url'))
  const [headerTaglineZh, setHeaderTaglineZh] = useState(getConfig('header_tagline_zh', 'zh'))
  const [headerTaglineEn, setHeaderTaglineEn] = useState(getConfig('header_tagline_en', 'en'))
  const [uploadingHeader, setUploadingHeader] = useState(false)

  // Upload a new logo file → store URL in site_configs.header_logo_url.
  // Reuses the same /api/upload route + 'banners' dir as the hero images
  // upload. Returns the public URL (Next.js calls it with /lawfirm/ prefix
  // automatically for relative paths via the upload route's basePath logic).
  const handleHeaderUpload = async (file: File) => {
    setUploadingHeader(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'banners')
      const upRes = await fetch(`${clientBasePath()}/api/upload`, { method: 'POST', body: formData })
      if (!upRes.ok) {
        const err = await upRes.json().catch(() => ({}))
        throw new Error(err.error || '上传失败')
      }
      const result = await upRes.json()
      setHeaderLogoUrl(result.url)
      // Immediately persist to DB so the user doesn't have to also click Save.
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'header_logo_url', value: result.url }),
      })
      setMessage('Logo 上传成功')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploadingHeader(false)
    }
  }

  // Remove the custom logo: clear the DB value so the page falls back to
  // the auto-generated first-character monogram.
  const handleHeaderRemove = async () => {
    if (!confirm('清除自定义 logo？页面会回到默认首字母占位。')) return
    setUploadingHeader(true)
    try {
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'header_logo_url', value: '' }),
      })
      setHeaderLogoUrl('')
      setMessage('Logo 已恢复默认占位')
      router.refresh()
    } catch {
      alert('清除失败')
    } finally {
      setUploadingHeader(false)
    }
  }

  // Save tagline text values (persists to site_configs).
  const handleSaveHeader = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      for (const [k, v, lang] of [
        ['header_tagline_zh', headerTaglineZh, 'zh'],
        ['header_tagline_en', headerTaglineEn, 'en'],
      ] as const) {
        await fetch(`${clientBasePath()}/api/admin/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: k, value: v, language: lang }),
        })
      }
      setMessage('网站 Logo 文案保存成功')
      router.refresh()
    } catch {
      setMessage('保存失败')
    } finally {
      setLoading(false)
    }
  }

  // Human-readable label for each hero slot. Used by upload/remove handlers
  // and the section UI below.
  function slotLabel(slot: string): string {
    return {
      about:    '关于我们',
      services: '服务领域',
      contact:  '联系我们',
      careers:  '招贤纳士',
      team:     '专业团队',
      news:     '资讯动态',
      cases:    '案例展示',
    }[slot] || slot
  }
  const heroSlots = ['about', 'services', 'contact', 'careers', 'team', 'news', 'cases'] as const

  // About section state
  const [about, setAbout] = useState({
    imageUrl: getConfig('homepage_about_image_url'),
    titleZh: getConfig('homepage_about_title_zh', 'zh'),
    titleEn: getConfig('homepage_about_title_en', 'en'),
    contentZh: getConfig('homepage_about_content_zh', 'zh'),
    contentEn: getConfig('homepage_about_content_en', 'en'),
  })

  // Homepage stats (admin-editable numeric values)
  const [stats, setStats] = useState({
    years:   getConfig('stats_years')   || '20+',
    cases:   getConfig('stats_cases')   || '1000+',
    lawyers: getConfig('stats_lawyers') || '50+',
  })

  // Hero background images for each public page (admin-editable URLs)
  const [heroImages, setHeroImages] = useState<Record<string, string>>({
    about:    getConfig('hero_bg_about')    || '',
    services: getConfig('hero_bg_services') || '',
    contact:  getConfig('hero_bg_contact')  || '',
    careers:  getConfig('hero_bg_careers')  || '',
    team:     getConfig('hero_bg_team')     || '',
    news:     getConfig('hero_bg_news')     || '',
    cases:    getConfig('hero_bg_cases')    || '',
  })

  // Which hero image slot is currently uploading ('about' | 'services' | ... | null)
  const [uploadingHero, setUploadingHero] = useState<string | null>(null)

  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Save firm_name zh
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'firm_name', value: basicInfo.firmNameZh, language: 'zh' }),
      })
      // Save firm_name en
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'firm_name', value: basicInfo.firmNameEn, language: 'en' }),
      })
      // Save address
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'address', value: basicInfo.address }),
      })
      // Save phone
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phone', value: basicInfo.phone }),
      })
      // Save email
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'email', value: basicInfo.email }),
      })

      setMessage('基本信息保存成功')
      router.refresh()
    } catch {
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
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_image_url', value: about.imageUrl }),
      })
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_title_zh', value: about.titleZh, language: 'zh' }),
      })
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_title_en', value: about.titleEn, language: 'en' }),
      })
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_content_zh', value: about.contentZh, language: 'zh' }),
      })
      await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_about_content_en', value: about.contentEn, language: 'en' }),
      })

      setMessage('关于我们设置保存成功')
      router.refresh()
    } catch {
      setMessage('保存失败')
    } finally {
      setLoading(false)
    }
  }

  // Save the three homepage stats numbers (single batch of 3 PUTs).
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      for (const [k, v] of [
        ['stats_years',   stats.years],
        ['stats_cases',   stats.cases],
        ['stats_lawyers', stats.lawyers],
      ] as const) {
        await fetch(`${clientBasePath()}/api/admin/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: k, value: v }),
        })
      }
      setMessage('首页数据保存成功')
      router.refresh()
    } catch {
      setMessage('保存失败')
    } finally {
      setLoading(false)
    }
  }

  // Upload an image for a hero slot, then auto-save the resulting URL to
  // SiteConfig. type='banners' so files land in /uploads/banners/.
  const handleHeroUpload = async (file: File, slot: string) => {
    const configKey = `hero_bg_${slot}`
    setUploadingHero(slot)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'banners')

      const upRes = await fetch(`${clientBasePath()}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      if (!upRes.ok) {
        const err = await upRes.json().catch(() => ({}))
        throw new Error(err.error || '上传失败')
      }
      const result = await upRes.json()

      const saveRes = await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: configKey, value: result.url }),
      })
      if (!saveRes.ok) throw new Error('保存设置失败')

      setHeroImages((prev) => ({ ...prev, [slot]: result.url }))
      setMessage(`${slotLabel(slot)} 背景图已更新`)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploadingHero(null)
    }
  }

  // Remove a hero image (clear the URL in SiteConfig so the page falls back
  // to its default unsplash image).
  const handleHeroRemove = async (slot: string) => {
    if (!confirm(`清除 ${slotLabel(slot)} 的自定义背景图？页面会回到默认占位。`)) return
    setUploadingHero(slot)
    try {
      const res = await fetch(`${clientBasePath()}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: `hero_bg_${slot}`, value: '' }),
      })
      if (!res.ok) throw new Error('清除失败')
      setHeroImages((prev) => ({ ...prev, [slot]: '' }))
      setMessage(`${slotLabel(slot)} 已恢复默认背景`)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '清除失败')
    } finally {
      setUploadingHero(null)
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

      {/* 网站 Logo（Header + Footer 顶部那个 logo + 小黄字） */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">网站 Logo（Header + Footer 顶部）</h2>
        <p className="text-sm text-gray-500 mb-4">
          上传一张 logo 图片替换默认的首字母占位（“江”）；下方两个输入框控制 logo 下面那行小黄字。
        </p>

        {/* 当前 logo 预览 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-4">
          <div className="aspect-[4/1] flex items-center justify-center gap-4 p-6">
            {headerLogoUrl ? (
              <img
                src={headerLogoUrl}
                alt="header logo"
                className="max-h-20 max-w-[60%] object-contain"
              />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gold-500 rounded flex items-center justify-center shadow-md">
                  <span className="text-navy-900 font-bold text-2xl font-serif">
                    {(basicInfo.firmNameZh || '江').charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-navy-900">
                    {basicInfo.firmNameZh || '江苏德善(新沂)律师事务所'}
                  </div>
                  <div className="text-gold-600 text-xs tracking-widest uppercase">
                    {headerTaglineZh || '律师事务所'}
                  </div>
                </div>
              </div>
            )}
            {uploadingHeader && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm text-gray-700">
                上传中…
              </div>
            )}
          </div>
        </div>

        {/* 上传 + 移除 */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="header-logo-upload"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleHeaderUpload(file)
              e.target.value = ''
            }}
          />
          <label
            htmlFor="header-logo-upload"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
          >
            {headerLogoUrl ? '更换 Logo' : '上传 Logo'}
          </label>
          {headerLogoUrl && (
            <button
              type="button"
              onClick={handleHeaderRemove}
              disabled={uploadingHeader}
              className="text-sm text-gray-500 hover:text-red-600 disabled:opacity-50"
            >
              恢复默认
            </button>
          )}
          {headerLogoUrl && (
            <a
              href={headerLogoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600 truncate max-w-xs"
            >
              {headerLogoUrl}
            </a>
          )}
        </div>

        {/* Tagline 文本（2 个语言，2 个输入框） */}
        <form onSubmit={handleSaveHeader} className="space-y-4 border-t pt-4">
          <p className="text-sm text-gray-600">
            Logo 下面那行小黄字（如 “LAW FIRM” 或 “律师事务所”），按语言分别配置。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                小黄字 · 中文（zh）
              </label>
              <input
                type="text"
                value={headerTaglineZh}
                onChange={(e) => setHeaderTaglineZh(e.target.value)}
                placeholder="律师事务所"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                小黄字 · 英文（en）
              </label>
              <input
                type="text"
                value={headerTaglineEn}
                onChange={(e) => setHeaderTaglineEn(e.target.value)}
                placeholder="LAW FIRM"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存 Logo 文案'}
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

      {/* Homepage Stats Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">首页数据</h2>
        <p className="text-sm text-gray-500 mb-4">
          首页关于我们的 3 个数字统计。可以填 “20+”、“1000+”、“50+” 这种带符号的字符串。
        </p>
        <form onSubmit={handleSaveStats} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年经验</label>
              <input
                type="text"
                value={stats.years}
                onChange={(e) => setStats({ ...stats, years: e.target.value })}
                placeholder="20+"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">成功案例</label>
              <input
                type="text"
                value={stats.cases}
                onChange={(e) => setStats({ ...stats, cases: e.target.value })}
                placeholder="1000+"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">专业律师</label>
              <input
                type="text"
                value={stats.lawyers}
                onChange={(e) => setStats({ ...stats, lawyers: e.target.value })}
                placeholder="50+"
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
              {loading ? '保存中...' : '保存首页数据'}
            </button>
          </div>
        </form>
      </div>

      {/* Hero Background Images Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">页面头部背景图</h2>
        <p className="text-sm text-gray-500 mb-4">
          每个公开页顶部的 banner 背景图。上传后自动保存；点击右上 “恢复默认” 可清掉自定义、回到 unsplash 占位图。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroSlots.map((slot) => (
            <div key={slot} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="font-medium text-gray-900">{slotLabel(slot)}</div>
                {heroImages[slot] && (
                  <button
                    type="button"
                    onClick={() => handleHeroRemove(slot)}
                    disabled={uploadingHero === slot}
                    className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50"
                  >
                    恢复默认
                  </button>
                )}
              </div>
              <div className="aspect-[16/9] bg-gray-100 relative">
                {heroImages[slot] ? (
                  <img
                    src={heroImages[slot]}
                    alt={slotLabel(slot)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    使用默认占位图
                  </div>
                )}
                {uploadingHero === slot && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm text-gray-700">
                    上传中…
                  </div>
                )}
              </div>
              <div className="p-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`hero-upload-${slot}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleHeroUpload(file, slot)
                    e.target.value = ''  // allow re-selecting same file
                  }}
                />
                <label
                  htmlFor={`hero-upload-${slot}`}
                  className="block w-full text-center px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50"
                >
                  {heroImages[slot] ? '更换图片' : '选择图片'}
                </label>
              </div>
            </div>
          ))}
        </div>
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