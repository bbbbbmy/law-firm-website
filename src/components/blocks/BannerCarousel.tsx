'use client'

import { useState, useEffect } from 'react'
import type { BannerData } from '@/types'

interface BannerCarouselProps {
  banners: BannerData[]
  lang: 'zh' | 'en'
}

export default function BannerCarousel({ banners, lang }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) {
    return (
      <div className="relative h-[60vh] min-h-[400px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No banners available</p>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]
  const overlayText = lang === 'zh' ? currentBanner.overlayTextZh : currentBanner.overlayTextEn

  return (
    <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
      {/* Banner Image */}
      <img
        src={currentBanner.imageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {overlayText && (
            <div className="max-w-2xl">
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 whitespace-pre-line">
                {overlayText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous banner"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next banner"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}