import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decryptSession, type AdminSession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 注意：Next.js 14 middleware 收到的 request.nextUrl.pathname 是包含 basePath 的
  // （用户访问 /lawfirm/admin/foo，这里 pathname = '/lawfirm/admin/foo'）。
  // matcher 配置的 '/admin/:path*' 也会匹配带 basePath 的路径。
  //
  // NextResponse.redirect() 同样不会自动加 basePath，但会用 request.nextUrl
  // 作为基础。我们直接修改 clone 后的 pathname 即可：
  //   用户访问 /lawfirm/admin → pathname='/lawfirm/admin'
  //   想重定向到 /lawfirm/admin/login → 把 pathname 改成 '/lawfirm/admin/login'
  //   不要 'admin/login'（没 basePath）也不要 '/admin/login' + /lawfirm（重复）

  // Allow login page and static assets through
  if (
    pathname === '/lawfirm/admin/login' ||
    pathname.startsWith('/lawfirm/admin/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/lawfirm/api')
  ) {
    return NextResponse.next()
  }

  // Protect /admin routes
  if (pathname.startsWith('/lawfirm/admin')) {
    const sessionCookie = request.cookies.get('law-firm-admin-session')
    const session: AdminSession | null = sessionCookie
      ? await decryptSession(sessionCookie.value)
      : null

    if (!session?.isLoggedIn) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/lawfirm/admin/login'
      loginUrl.search = ''
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  // matcher 也写带 basePath 的版本（next.config.mjs 的 basePath 会在 matcher
  // 匹配前自动剥离，但 matcher 字符串里的 basePath 仍然是必需的）：
  //   实际上对于 matcher，next.js 文档说应该写"带 basePath 的形式"
  matcher: '/lawfirm/admin/:path*',
}