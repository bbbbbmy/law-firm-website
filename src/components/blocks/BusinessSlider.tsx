'use client'

import { useState } from 'react'
import type { BannerData, Language } from '@/types'

interface BusinessSliderProps {
  items: BannerData[]
  lang: Language
  title?: string
}

export default function BusinessSlider({ items, lang, title }: BusinessSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!items.length) return null

  const currentItem = items[currentIndex]
  const overlayText = lang === 'zh' ? currentItem.overlayTextZh : currentItem.overlayTextEn

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        )}

        <div className="relative">
          {/* Image */}
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={currentItem.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            {overlayText && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-lg font-medium whitespace-pre-line">
                  {overlayText}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          {items.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                aria-label="Next"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots */}
          {items.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}