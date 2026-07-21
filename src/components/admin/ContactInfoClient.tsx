'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ContactInfo {
  language: string
  address: string
  phone: string
  email: string
  wechatQrUrl: string
  serviceQrUrl: string
  mapUrl: string
}

export default function ContactInfoClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState<'wechat' | 'service' | null>(null)

  const [zhContact, setZhContact] = useState<ContactInfo>({
    language: 'zh',
    address: '',
    phone: '',
    email: '',
    wechatQrUrl: '',
    serviceQrUrl: '',
    mapUrl: '',
  })

  const [enContact, setEnContact] = useState<ContactInfo>({
    language: 'en',
    address: '',
    phone: '',
    email: '',
    wechatQrUrl: '',
    serviceQrUrl: '',
    mapUrl: '',
  })

  useEffect(() => {
    fetch('/api/admin/contact')
      .then(res => res.json())
      .then(data => {
        if (data.zh) {
          setZhContact({
            language: 'zh',
            address: data.zh.address || '',
            phone: data.zh.phone || '',
            email: data.zh.email || '',
            wechatQrUrl: data.zh.wechatQrUrl || '',
            serviceQrUrl: data.zh.serviceQrUrl || '',
            mapUrl: data.zh.mapUrl || '',
          })
        }
        if (data.en) {
          setEnContact({
            language: 'en',
            address: data.en.address || '',
            phone: data.en.phone || '',
            email: data.en.email || '',
            wechatQrUrl: data.en.wechatQrUrl || '',
            serviceQrUrl: data.en.serviceQrUrl || '',
            mapUrl: data.en.mapUrl || '',
          })
        }
      })
      .catch(console.error)
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'wechat' | 'service', lang: 'zh' | 'en') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(type)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'qrcodes')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('上传失败')
      }

      const result = await res.json()
      const url = result.url

      if (lang === 'zh') {
        setZhContact(prev => ({
          ...prev,
          [type === 'wechat' ? 'wechatQrUrl' : 'serviceQrUrl']: url,
        }))
      } else {
        setEnContact(prev => ({
          ...prev,
          [type === 'wechat' ? 'wechatQrUrl' : 'serviceQrUrl']: url,
        }))
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(null)
    }
  }

  const handleSave = async (lang: 'zh' | 'en') => {
    setLoading(true)
    setMessage('')

    const contact = lang === 'zh' ? zhContact : enContact

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })

      if (!res.ok) {
        throw new Error('保存失败')
      }

      setMessage(lang === 'zh' ? '中文联系信息保存成功' : 'English contact info saved')
      router.refresh()
    } catch {
      setMessage('保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">联系我们设置</h1>

      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chinese Contact */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">中文联系信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
              <input
                type="text"
                value={zhContact.address}
                onChange={(e) => setZhContact({ ...zhContact, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input
                type="text"
                value={zhContact.phone}
                onChange={(e) => setZhContact({ ...zhContact, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={zhContact.email}
                onChange={(e) => setZhContact({ ...zhContact, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">微信公众号二维码</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'wechat', 'zh')}
                className="hidden"
                id="wechat-qr-zh"
              />
              <label
                htmlFor="wechat-qr-zh"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-center cursor-pointer hover:bg-gray-50"
              >
                {uploading === 'wechat' ? '上传中...' : '选择图片'}
              </label>
              {zhContact.wechatQrUrl && (
                <div className="mt-2">
                  <img
                    src={zhContact.wechatQrUrl}
                    alt="微信公众号"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">服务号二维码</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'service', 'zh')}
                className="hidden"
                id="service-qr-zh"
              />
              <label
                htmlFor="service-qr-zh"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-center cursor-pointer hover:bg-gray-50"
              >
                {uploading === 'service' ? '上传中...' : '选择图片'}
              </label>
              {zhContact.serviceQrUrl && (
                <div className="mt-2">
                  <img
                    src={zhContact.serviceQrUrl}
                    alt="服务号"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地图链接</label>
              <input
                type="url"
                value={zhContact.mapUrl}
                onChange={(e) => setZhContact({ ...zhContact, mapUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => handleSave('zh')}
                disabled={loading}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? '保存中...' : '保存中文'}
              </button>
            </div>
          </div>
        </div>

        {/* English Contact */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">English Contact Info</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={enContact.address}
                onChange={(e) => setEnContact({ ...enContact, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={enContact.phone}
                onChange={(e) => setEnContact({ ...enContact, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={enContact.email}
                onChange={(e) => setEnContact({ ...enContact, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WeChat QR Code</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'wechat', 'en')}
                className="hidden"
                id="wechat-qr-en"
              />
              <label
                htmlFor="wechat-qr-en"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-center cursor-pointer hover:bg-gray-50"
              >
                {uploading === 'wechat' ? 'Uploading...' : 'Choose Image'}
              </label>
              {enContact.wechatQrUrl && (
                <div className="mt-2">
                  <img
                    src={enContact.wechatQrUrl}
                    alt="WeChat"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Account QR Code</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'service', 'en')}
                className="hidden"
                id="service-qr-en"
              />
              <label
                htmlFor="service-qr-en"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-center cursor-pointer hover:bg-gray-50"
              >
                {uploading === 'service' ? 'Uploading...' : 'Choose Image'}
              </label>
              {enContact.serviceQrUrl && (
                <div className="mt-2">
                  <img
                    src={enContact.serviceQrUrl}
                    alt="Service Account"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Map URL</label>
              <input
                type="url"
                value={enContact.mapUrl}
                onChange={(e) => setEnContact({ ...enContact, mapUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => handleSave('en')}
                disabled={loading}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save English'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
