import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decryptSession, type AdminSession } from '@/lib/session'

// 从 request.url（原始 URL 字符串）反推 pathname，绕开 NextResponse/URL.clone() 的歧义
function rawPathname(request: NextRequest): string {
  try {
    return new URL(request.url).pathname
  } catch {
    return ''
  }
}

export async function middleware(request: NextRequest) {
  const path = rawPathname(request)

  // Allow login page and static assets through
  // 注意：path 已确认包含 basePath（'/lawfirm/...'）
  if (
    path === '/lawfirm/admin/login' ||
    path.startsWith('/lawfirm/admin/login') ||
    path.startsWith('/lawfirm/_next') ||
    path.startsWith('/lawfirm/uploads') ||
    path.startsWith('/lawfirm/api')
  ) {
    return NextResponse.next()
  }

  // Protect /lawfirm/admin routes
  if (path.startsWith('/lawfirm/admin')) {
    const sessionCookie = request.cookies.get('law-firm-admin-session')
    const session: AdminSession | null = sessionCookie
      ? await decryptSession(sessionCookie.value)
      : null

    if (!session?.isLoggedIn) {
      // 用 new URL(request.url) 重建完整 URL（含 host + port），再覆盖 pathname。
      // 这绕开了 clone 的歧义。
      const loginUrl = new URL(request.url)
      loginUrl.pathname = '/lawfirm/admin/login'
      loginUrl.search = ''
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}