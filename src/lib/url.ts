/**
 * 客户端 URL 工具：把相对路径拼成带 basePath 的完整 URL。
 *
 * 背景：next.config.mjs 设了 basePath = '/lawfirm'，但 <Link href="/..."> 这种
 * 字符串拼接会绕过 basePath 自动处理（生成 /team 而不是 /lawfirm/team）。
 *
 * 解决办法：从当前 URL 推 basePath，再用工具函数拼。
 */

declare const window: any

/**
 * 从 window.location.pathname 推 basePath。
 *   /lawfirm/zh/team → '/lawfirm'
 *   /lawfirm/zh      → '/lawfirm'
 *   /zh              → ''  (部署在根路径时)
 */
export function detectBasePath(): string {
  if (typeof window === 'undefined') return '/lawfirm'
  // 当前 URL 一定有 /zh 或 /en，分割即可
  const p = window.location.pathname
  for (const seg of ['/zh', '/en']) {
    const idx = p.indexOf(seg)
    if (idx >= 0) return p.slice(0, idx) || ''
  }
  return '/lawfirm'  // fallback
}

/**
 * 把任意相对 path 拼成完整 URL（带 basePath + 语言切换）
 *   buildHref('/team', 'zh')       → '/lawfirm/zh/team'
 *   buildHref('/', 'en')            → '/lawfirm/en'
 *   buildHref('/team', undefined)   → '/lawfirm/zh/team'  (用当前页面的语言)
 */
export function buildHref(path: string, lang?: string): string {
  const base = detectBasePath()
  // 从 window 拿当前语言（备用）
  let langSeg = lang
  if (!langSeg && typeof window !== 'undefined') {
    const p = window.location.pathname
    if (p.includes('/en/') || p.endsWith('/en')) langSeg = 'en'
    else langSeg = 'zh'
  }
  langSeg = langSeg || 'zh'

  if (path === '/' || path === '') return `${base}/${langSeg}`
  return `${base}/${langSeg}${path}`
}
