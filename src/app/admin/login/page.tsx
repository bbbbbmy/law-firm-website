'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 在客户端运行时计算 basePath。
 *
 * 为什么不用 process.env.NEXT_PUBLIC_BASE_PATH？
 *   next.config.mjs 的 basePath 字段不会自动暴露成 NEXT_PUBLIC_BASE_PATH，
 *   而 webpack 只会替换源码中字面量出现的 process.env.NEXT_PUBLIC_* 引用，
 *   所以直接读这个变量在客户端是 undefined。
 *
 * 可靠做法：从当前 URL 反推。当前页是 /lawfirm/admin/login 时：
 *   pathname = "/lawfirm/admin/login"
 *   取掉最后两段 "/admin/login" 得到 basePath = "/lawfirm"。
 *
 * 如果部署到根路径（basePath=""），则取掉 "/admin/login" 得空串，符合预期。
 */
function detectBasePath(): string {
  if (typeof window === 'undefined') return ''
  const p = window.location.pathname
  // 匹配 /<base>/admin/login 或 /admin/login
  const m = p.match(/^(\/[^/]*)?\/admin\/login\/?$/)
  return m && m[1] ? m[1] : ''
}

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const basePath = detectBasePath()

    try {
      const res = await fetch(`${basePath}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '登录失败')
        return
      }

      router.push(`${basePath}/admin`)
      router.refresh()
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">江苏德善(新沂)律师事务所管理后台</h1>
        <p className="text-gray-600 mt-2">Law Firm Admin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            账号
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="请输入账号"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="请输入密码"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>默认账号: admin / admin123</p>
      </div>
    </div>
  )
}