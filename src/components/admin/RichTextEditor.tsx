'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showImageUrlInput, setShowImageUrlInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  // Initialize editor with value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }, [updateContent])

  const handleImageInsert = () => {
    if (imageUrl.trim()) {
      execCommand('insertImage', imageUrl.trim())
      setImageUrl('')
      setShowImageUrlInput(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      execCommand('insertHTML', '<br>')
    }
  }

  // Apply inline style to selection using span wrapping
  const applyStyleToSelection = (styleName: string, styleValue: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (range.collapsed) {
      // No selection, do nothing
      return
    }

    try {
      // Try surroundContents first (works for simple selections)
      const span = document.createElement('span')
      span.style[styleName as any] = styleValue
      range.surroundContents(span)
    } catch (e) {
      // If that fails (complex selection), use insertNode approach
      try {
        const span = document.createElement('span')
        span.style[styleName as any] = styleValue
        const fragment = range.extractContents()
        span.appendChild(fragment)
        range.insertNode(span)
      } catch (e2) {
        // Fallback: just apply to parent element if available
        const parent = selection.anchorNode?.parentElement
        if (parent) {
          (parent as HTMLElement).style[styleName as any] = styleValue
        }
      }
    }
    updateContent()
  }

  // Apply font size using inline style
  const handleFontSizeChange = (size: string) => {
    applyStyleToSelection('fontSize', size)
  }

  // Apply text color using inline style
  const handleTextColor = (color: string) => {
    applyStyleToSelection('color', color)
  }

  // Check if current selection has a specific style
  const hasStyle = (styleName: string): boolean => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return false
    const node = selection.anchorNode
    if (!node) return false
    const element = node.parentElement
    if (!element) return false
    const style = (element as HTMLElement).style[styleName as any]
    return !!style
  }

  const actions = [
    { id: 'bold', label: '粗体', icon: <span className="font-bold">B</span>, command: 'bold' },
    { id: 'italic', label: '斜体', icon: <span className="italic">I</span>, command: 'italic' },
    { id: 'underline', label: '下划线', icon: <span className="underline">U</span>, command: 'underline' },
    { id: 'strikeThrough', label: '删除线', icon: <span className="line-through">S</span>, command: 'strikeThrough' },
  ]

  const fontSizes = [
    { label: '小', value: '14px' },
    { label: '正常', value: '16px' },
    { label: '中', value: '18px' },
    { label: '大', value: '22px' },
    { label: '特大', value: '28px' },
  ]

  const colors = ['#000000', '#ff0000', '#00aa00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#d4a84b']

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Font Style Buttons */}
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => execCommand(action.command)}
            title={action.label}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-700 hover:bg-gray-200"
          >
            {action.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Font Size Select */}
        <select
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className="h-8 px-2 text-sm border border-gray-300 rounded bg-white"
          title="字体大小"
        >
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Color */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 mr-1">颜色:</span>
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleTextColor(color)}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200"
          title="左对齐"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 5h18v2H3V5zm0 6h12v2H3v-2zm0 6h18v2H3v-2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200"
          title="居中对齐"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 5h18v2H3V5zm3 6h12v2H6v-2zm-3 6h18v2H3v-2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200"
          title="右对齐"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 5h18v2H3V5zm6 6h12v2H9v-2zm-6 6h18v2H3v-2z" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200"
          title="无序列表"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v2H4V4zm0 7h16v2H4v-2zm0 7h16v2H4v-2z" />
            <circle cx="2" cy="5" r="1" />
            <circle cx="2" cy="12" r="1" />
            <circle cx="2" cy="19" r="1" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200"
          title="有序列表"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v2H4V4zm0 7h16v2H4v-2zm0 7h16v2H4v-2z" />
            <text x="2" y="7" fontSize="6">1</text>
            <text x="2" y="14" fontSize="6">2</text>
            <text x="2" y="21" fontSize="6">3</text>
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = prompt('输入链接地址:')
            if (url) {
              execCommand('createLink', url)
            }
          }}
          className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200"
          title="插入链接"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={() => setShowImageUrlInput(!showImageUrlInput)}
          className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200"
          title="插入图片"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="w-8 h-8 flex items-center justify-center rounded text-gray-700 hover:bg-gray-200 text-xs"
          title="清除格式"
        >
          Clr
        </button>
      </div>

      {/* Image URL Input */}
      {showImageUrlInput && (
        <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="输入图片地址..."
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleImageInsert()}
          />
          <button
            type="button"
            onClick={handleImageInsert}
            className="px-3 py-1.5 bg-gold-600 text-white rounded text-sm hover:bg-gold-700"
          >
            插入
          </button>
          <button
            type="button"
            onClick={() => {
              setShowImageUrlInput(false)
              setImageUrl('')
            }}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm"
          >
            取消
          </button>
        </div>
      )}

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onKeyDown={handleKeyDown}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{ fontFamily: 'system-ui, Microsoft YaHei, sans-serif' }}
        data-placeholder={placeholder || '输入文章内容...'}
        suppressContentEditableWarning
      />

      {/* Hidden textarea for form submission */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
      />
    </div>
  )
}