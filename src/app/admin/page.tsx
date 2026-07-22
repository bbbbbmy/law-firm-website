import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [articleCount, teamMemberCount, bannerCount, contactZh, contactEn] = await Promise.all([
    prisma.article.count(),
    prisma.teamMember.count(),
    prisma.banner.count(),
    prisma.contactInfo.findUnique({ where: { language: 'zh' } }),
    prisma.contactInfo.findUnique({ where: { language: 'en' } }),
  ])

  // 联系我们配置状态：中英双份都有才算"已配置"
  const contactConfigured = Boolean(contactZh && contactEn)
  const contactStatus = contactConfigured ? '✓' : '—'

  const stats = [
    { label: '文章总数', value: articleCount, icon: '📝', href: '/admin/articles' },
    { label: '团队成员', value: teamMemberCount, icon: '👥', href: '/admin/team' },
    { label: 'Banner图片', value: bannerCount, icon: '🖼️', href: '/admin/banners' },
    { label: '联系我们', value: contactStatus, icon: '📞', href: '/admin/contact' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">管理后台概览</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction href="/admin/articles/new" icon="➕" label="新建文章" />
          <QuickAction href="/admin/team/new" icon="👤" label="添加成员" />
          <QuickAction href="/admin/banners" icon="🖼️" label="管理Banner" />
          <QuickAction href="/admin/media" icon="📁" label="上传图片" />
          <QuickAction href="/admin/contact" icon="📞" label="联系我们" />
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string
  icon: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm text-gray-700">{label}</span>
    </Link>
  )
}