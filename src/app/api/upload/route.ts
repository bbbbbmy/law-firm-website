import { NextResponse, type NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

// 从 NextRequest 拿 basePath（Next.js 14 server 端会正确解析）。
// request.nextUrl.basePath 返回 next.config.mjs 里的 basePath（'/lawfirm'）。
function basePathOf(request: NextRequest): string {
  return request.nextUrl.basePath || ''
}

export async function GET(request: NextRequest) {
  try {
    const basePath = basePathOf(request)
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
    const basePath = basePathOf(request)
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