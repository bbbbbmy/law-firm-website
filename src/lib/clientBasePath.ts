// Client-only basePath detection.
//
// Splits the current URL pathname at the first "/admin" segment. Works for
// both basePath="/lawfirm" deployments (/lawfirm/admin/media → "/lawfirm")
// and root deployments (/admin/media → ""). Must run in the browser —
// `typeof window === 'undefined'` is the SSR pre-hydration guard.
//
// Use this to prefix any client-side fetch() to an /api/ route so that the
// request hits the Next.js basePath-aware routing. Server code should read
// basePath from next.config.mjs or NEXT_PUBLIC_BASE_PATH, not from here.
export function clientBasePath(): string {
  if (typeof window === 'undefined') return ''
  const idx = window.location.pathname.indexOf('/admin')
  return idx >= 0 ? window.location.pathname.slice(0, idx) : ''
}
