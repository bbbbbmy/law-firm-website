import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decryptSession, type AdminSession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 注意：Next.js 14 的 middleware 收到的 pathname 已经剥离了 basePath，
  // 所以这里写 '/admin/login' 是对的（用户访问的是 '/lawfirm/admin/login'）。
  // 但是 NextResponse.redirect(new URL(...)) 不会自动加 basePath，
  // 必须用 request.nextUrl 拷贝再修改 path，或者手动拼 basePath。
  const basePath = '/lawfirm'

  // Allow login page and static assets through
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('law-firm-admin-session')
    const session: AdminSession | null = sessionCookie
      ? await decryptSession(sessionCookie.value)
      : null

    if (!session?.isLoggedIn) {
      // 用 request.nextUrl.clone() 保留 basePath + host，再修改路径
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = `${basePath}/admin/login`
      loginUrl.search = ''
      loginUrl.searchParams.set('redirect', `${basePath}${pathname}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}