import { prisma } from '@/lib/prisma'

interface SiteConfig {
  key: string
  value: string | null
  language: string | null
}

export default async function SettingsPage() {
  const configs: SiteConfig[] = await prisma.siteConfig.findMany() as SiteConfig[]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">网站设置</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                律所名称 (中文)
              </label>
              <input
                type="text"
                defaultValue={configs.find(c => c.key === 'firm_name' && c.language === 'zh')?.value || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                律所名称 (英文)
              </label>
              <input
                type="text"
                defaultValue={configs.find(c => c.key === 'firm_name' && c.language === 'en')?.value || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              联系地址
            </label>
            <input
              type="text"
              defaultValue={configs.find(c => c.key === 'address')?.value || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                联系电话
              </label>
              <input
                type="text"
                defaultValue={configs.find(c => c.key === 'phone')?.value || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                电子邮箱
              </label>
              <input
                type="email"
                defaultValue={configs.find(c => c.key === 'email')?.value || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              保存设置
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">修改密码</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              当前密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              确认新密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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