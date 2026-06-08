import fs from 'fs'
import path from 'path'

// Determine if we're in production (OSS configured) or development
const isProduction = Boolean(process.env.OSS_ACCESS_KEY_ID && process.env.OSS_BUCKET)

interface UploadResult {
  url: string
  filename: string
}

interface UploadOptions {
  type: 'banners' | 'team' | 'articles' | 'qrcodes'
}

export async function uploadFile(
  file: Buffer,
  filename: string,
  options: UploadOptions
): Promise<UploadResult> {
  if (isProduction) {
    return uploadToOSS(file, filename, options)
  } else {
    return saveLocally(file, filename, options)
  }
}

async function saveLocally(
  file: Buffer,
  filename: string,
  options: UploadOptions
): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', options.type)

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const uniqueFilename = `${Date.now()}-${filename}`
  const filePath = path.join(uploadDir, uniqueFilename)

  fs.writeFileSync(filePath, file)

  const url = `/uploads/${options.type}/${uniqueFilename}`

  return { url, filename: uniqueFilename }
}

async function uploadToOSS(
  file: Buffer,
  filename: string,
  options: UploadOptions
): Promise<UploadResult> {
  // OSS upload will be implemented when ali-oss is configured
  // For now, fall back to local storage
  console.warn('OSS not configured, falling back to local storage')
  return saveLocally(file, filename, options)
}

export function validateFile(file: Buffer, mimeType: string, fileSize: number): void {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(mimeType)) {
    throw new Error('Only image files are allowed')
  }

  if (fileSize > maxSize) {
    throw new Error('File size must be under 5MB')
  }
}