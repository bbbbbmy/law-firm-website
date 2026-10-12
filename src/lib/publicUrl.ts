/**
 * Build an absolute public URL from a base URL + a (possibly already
 * basePath-prefixed or absolute) path. Idempotent against:
 *
 *   1. Trailing slash on baseUrl — strip before join, no `//` ugly.
 *   2. basePath collision — when both baseUrl ends with /lawfirm AND url
 *      starts with /lawfirm, strip the /lawfirm prefix from url so we
 *      don't get /lawfirm/lawfirm/... 404s.
 *   3. url already absolute (e.g. OSS returns full https://...) — return
 *      as-is so we don't glue two schemes together.
 *
 * contract:
 *   publicUrl('', '')                  → ''
 *   publicUrl('', '/x.jpg')            → '/x.jpg'
 *   publicUrl('https://h', '')         → 'https://h'
 *   publicUrl('https://h', '/x.jpg')   → 'https://h/x.jpg'
 *   publicUrl('https://h/', '/x.jpg')  → 'https://h/x.jpg'
 *   publicUrl('https://h', 'https://a/b') → 'https://a/b'
 *   publicUrl('https://h/lawfirm', '/lawfirm/uploads/x.jpg')
 *                                       → 'https://h/lawfirm/uploads/x.jpg'
 *   publicUrl('https://h', '/lawfirm/uploads/x.jpg')
 *                                       → 'https://h/lawfirm/uploads/x.jpg'
 */
export function publicUrl(baseUrl: string, url: string): string {
  if (!url) return baseUrl
  // Already absolute? Don't touch.
  if (/^https?:\/\//i.test(url)) return url

  // Strip trailing slashes from base (but keep "" if base is "").
  const base = baseUrl.replace(/\/+$/, '')

  // If both base ends with /lawfirm AND url starts with /lawfirm,
  // drop the redundant prefix from url.
  const basePath = '/lawfirm'
  if (base.endsWith(basePath) && url.startsWith(basePath)) {
    return base + url.slice(basePath.length)
  }

  // Normalize: if url doesn't start with /, prefix one (so we never
  // produce 'hostupload' when caller forgot the slash).
  const path = url.startsWith('/') ? url : '/' + url

  if (!base) return path
  return base + path
}
