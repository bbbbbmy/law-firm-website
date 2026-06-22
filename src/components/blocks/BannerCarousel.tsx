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
      <div className="relative h-[60vh] min-h-[400px] bg-navy-900 flex items-center justify-center">
        <div className="w-20 h-1 bg-gold-500/30 mb-4" />
        <p className="text-navy-400">No banners available</p>
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
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-transparent" />

      {/* Gold accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {overlayText && (
            <div className="max-w-3xl">
              <div className="w-16 h-1 bg-gold-500 mb-6" />
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 whitespace-pre-line leading-tight">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-navy-900/50 hover:bg-navy-900/80 border border-gold-500/30 hover:border-gold-500/50 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Previous banner"
          >
            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-navy-900/50 hover:bg-navy-900/80 border border-gold-500/30 hover:border-gold-500/50 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Next banner"
          >
            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-gold-500 w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}