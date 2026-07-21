'use client'

import { useState, useEffect } from 'react'

interface MediaFile {
  filename: string
  url: string
  type: string
  createdAt: string
}

export default function MediaPage() {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

  useEffect(() => {
    // Load existing media files from local storage
    loadMediaFiles()
  }, [])

  const loadMediaFiles = () => {
    // For now, we'll scan the uploads directory via API
    // Since this is a client component, we'll fetch from an API
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/upload`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.files)) {
          setMediaFiles(data.files)
        }
      })
      .catch(() => {
        // If API doesn't exist yet, show empty
      })
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'media')

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const error = await res.json()
          alert(`上传失败: ${error.error}`)
          continue
        }

        const result = await res.json()
        setMediaFiles(prev => [...prev, {
          filename: result.filename,
          url: result.url,
          type: 'media',
          createdAt: new Date().toISOString(),
        }])
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('上传失败')
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url)
    alert('链接已复制')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">媒体库</h1>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center mb-8 transition-colors ${
          dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleUpload(e.dataTransfer.files)
        }}
      >
        <div className="text-4xl mb-4">📁</div>
        <p className="text-gray-600 mb-4">
          拖拽图片到此处，或
          <label className="text-primary-600 hover:underline cursor-pointer mx-1">
            选择文件
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </p>
        <p className="text-sm text-gray-400">
          支持 JPG, PNG, GIF, WebP，单个文件最大 5MB
        </p>
        {uploading && (
          <p className="mt-4 text-primary-600">上传中...</p>
        )}
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">已上传的图片</h2>
        {mediaFiles.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            暂无图片，请上传
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => copyUrl(file.url)}
                    className="bg-white text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-100"
                  >
                    复制链接
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{file.filename}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}