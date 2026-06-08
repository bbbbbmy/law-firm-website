import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
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
        url: `/uploads/media/${filename}`,
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

export async function POST(request: Request) {
  try {
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

    const url = `/uploads/${type}/${uniqueFilename}`

    return NextResponse.json({ url, filename: uniqueFilename })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}