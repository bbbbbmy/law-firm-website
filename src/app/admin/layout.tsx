import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('admin_session')?.value

  if (!sessionId) {
    redirect('/admin/login')
  }

  // Verify admin exists
  const admin = await prisma.admin.findUnique({
    where: { id: sessionId },
  })

  if (!admin) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="font-bold text-lg text-gray-900">
              管理后台
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-sm text-primary-600 hover:underline"
            >
              查看网站 →
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">欢迎, {admin.username}</span>
            <form action="/api/admin/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-red-600"
              >
                退出
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className="fixed left-0 top-14 bottom-0 w-64 bg-white shadow-lg overflow-y-auto">
          <nav className="p-4 space-y-1">
            <SidebarLink href="/admin" icon="📊" label="概览" />
            <SidebarLink href="/admin/articles" icon="📝" label="文章管理" />
            <SidebarLink href="/admin/team" icon="👥" label="团队成员" />
            <SidebarLink href="/admin/banners" icon="🖼️" label="Banner管理" />
            <SidebarLink href="/admin/media" icon="📁" label="媒体库" />
            <SidebarLink href="/admin/settings" icon="⚙️" label="网站设置" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarLink({
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
      className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}