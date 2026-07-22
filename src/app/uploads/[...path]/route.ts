import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Next.js 14 standalone 不 serve 运行时上传到 public/uploads/ 的文件。
// 这个 route handler 在 /uploads/[...path] 提供文件流。
//
// 注意：basePath 已经被 Next.js 自动剥离，所以这里 path 是相对 /uploads 的路径。
// 例如 GET /lawfirm/uploads/media/foo.jpg → params.path = ["media", "foo.jpg"]
export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // 安全：禁止路径穿越
    const segments = (params.path || []).map(s =>
      String(s).replace(/\\/g, '/').split('/').pop()
    ).filter(Boolean)
    if (segments.length === 0 || segments.some(s => s.includes('..'))) {
      return new NextResponse('Invalid path', { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', ...segments)

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Not found', { status: 404 })
    }

    const stat = fs.statSync(filePath)
    if (!stat.isFile()) {
      return new NextResponse('Not a file', { status: 400 })
    }

    const buffer = fs.readFileSync(filePath)
    // 根据扩展名猜 mime（够用）
    const ext = path.extname(filePath).toLowerCase()
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    }
    const contentType = mimeMap[ext] || 'application/octet-stream'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('serve upload error:', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
