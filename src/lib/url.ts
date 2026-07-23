/**
 * 客户端 URL 工具：把相对路径拼成"以 / 开头、不含 basePath"的相对路径。
 *
 * 重要：<Link href="/zh/team"> 这种相对路径会**自动**被 Next.js 加 basePath
 *       变成 /lawfirm/zh/team。所以 buildHref 只需要返 /zh/team，不需要 /lawfirm。
 *
 * 历史：之前 buildHref 返 /lawfirm/... 完整 URL，跟 <Link> 重复加 basePath，
 *       导致 /lawfirm/lawfirm/zh/team 这种"双 basePath" 404。
 */

declare const window: any

/**
 * 把任意 path 拼成"以 / 开头"的相对路径（不含 basePath）
 *   buildHref('/team', 'zh')     → '/zh/team'
 *   buildHref('/', 'en')          → '/en'
 *   buildHref('/team')            → '/zh/team'  (用当前页面语言)
 */
export function buildHref(path: string, lang?: string): string {
  // 推断当前语言
  let langSeg = lang
  if (!langSeg && typeof window !== 'undefined') {
    const p = window.location.pathname
    if (p.includes('/en/') || p.endsWith('/en')) langSeg = 'en'
    else langSeg = 'zh'
  }
  langSeg = langSeg || 'zh'

  if (path === '/' || path === '') return `/${langSeg}`
  return `/${langSeg}${path}`
}