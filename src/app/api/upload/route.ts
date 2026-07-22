import { NextResponse, type NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

// 从 NextRequest 拿 basePath。
// 注：Next.js 14 在 App Router 下会把 basePath 从 nextUrl.pathname 剥离，
// 所以 request.nextUrl.basePath 总是空字符串。
// 但 next.config.mjs 的 basePath 是固定值，直接从配置文件读最稳。
function basePathOf(): string {
  // 读 next.config.mjs 的 basePath
  // 这里硬编码是因为 next.config.mjs 不容易被 server runtime 引用
  // 如果你想动态读，可以 require('@/next.config') 但 Next.js 不导出
  return '/lawfirm'
}

export async function GET(request: NextRequest) {
  try {
    const basePath = basePathOf()
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'media')

    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ files: [] })
    }

    const files = fs.readdirSync(uploadDir)
    const mediaFiles = files.map(filename => {
      const filePath = path.join(uploadDir, filename)
      const stats = fs.statSync(filePath)

      return {
        filename,
        url: `${basePath}/uploads/media/${filename}`,
        type: 'media',
        createdAt: stats.birthtime.toISOString(),
      }
    })

    return NextResponse.json({ files: mediaFiles })
  } catch (error) {
    console.error('Error reading media files:', error)
    return NextResponse.json({ files: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const basePath = basePathOf()
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string) || 'media'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save locally
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type)

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadDir, uniqueFilename)

    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({
      url: `${basePath}/uploads/${type}/${uniqueFilename}`,
      filename: uniqueFilename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}