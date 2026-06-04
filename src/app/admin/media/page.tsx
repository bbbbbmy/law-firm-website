'use client'

import { useState } from 'react'

export default function MediaPage() {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    // TODO: Implement actual file upload to OSS
    setTimeout(() => {
      setUploading(false)
    }, 1000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">媒体库</h1>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center mb-8 ${
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            暂无图片
          </div>
        </div>
      </div>
    </div>
  )
}