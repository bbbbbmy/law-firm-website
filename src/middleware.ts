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

  // 根 URL rewrite 到 /lawfirm/zh，让根 URL 渲染含 verification meta 的页面
  // baidu/bing 等 HTML meta 验证工具访问根 URL 就能拿到 meta，无需跟随 redirect
  if (path === '/lawfirm' || path === '/lawfirm/' || path === '/' || path === '') {
    // 用 /zh 而非 /lawfirm/zh,否则 Next.js 14 会把 basePath 重复叠加
    // (设置 url.pathname = '/lawfirm/zh' 在有 basePath 的请求里会变成 /lawfirm/lawfirm/zh)
    const url = request.nextUrl.clone()
    url.pathname = '/zh'
    return NextResponse.rewrite(url)
  }

  // 兜底重定向：如果用户输错路径（漏了 /lawfirm 前缀），自动跳到带 basePath 的版本。
  // 例：/zh/team → /lawfirm/zh/team
  //     /admin/login → /lawfirm/admin/login
  //     /api/admin/auth → /lawfirm/api/admin/auth
  if (path && !path.startsWith('/lawfirm') && !path.startsWith('/_next') && !path.startsWith('/favicon')) {
    // 这是个不常见的内部路径，重定向到带 basePath 的版本
    const url = new URL(request.url)
    url.pathname = `/lawfirm${path}`
    return NextResponse.redirect(url)
  }

  // Allow login page and static assets through
  // 注意：path 已确认包含 basePath（'/lawfirm/...'）
  if (
    path === '/lawfirm/admin/login' ||
    path.startsWith('/lawfirm/admin/login') ||
    path.startsWith('/lawfirm/_next') ||
    path.startsWith('/lawfirm/uploads') ||
    // /api/admin/auth 本身是登录/登出/session 检测，不需要 auth 本身
    path === '/lawfirm/api/admin/auth' ||
    path === '/lawfirm/api/admin/auth/session' ||
    path === '/lawfirm/api/admin/auth/logout' ||
    // /api/upload /api/contact /api/health 都是公开 API
    path.startsWith('/lawfirm/api/upload') ||
    path.startsWith('/lawfirm/api/contact') ||
    path.startsWith('/lawfirm/api/health')
  ) {
    return NextResponse.next()
  }

  // /api/admin/* （登录/登出除外）也要 session 验证 — 否则 PII 泄漏
  if (path.startsWith('/lawfirm/api/admin')) {
    const sessionCookie = request.cookies.get('law-firm-admin-session')
    const session: AdminSession | null = sessionCookie
      ? await decryptSession(sessionCookie.value)
      : null
    if (!session?.isLoggedIn) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
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
  // matcher 数组:同时匹配 / 和 /foo/* (默认的 /((?!...).*)/ 在 path-to-regexp 下不匹配纯 /)
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/'],
}