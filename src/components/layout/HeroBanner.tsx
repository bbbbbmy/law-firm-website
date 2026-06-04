import type { Language } from '@/types'

interface HeroBannerProps {
  lang: Language
  title: string
  subtitle?: string
  backgroundImageUrl?: string
}

export default function HeroBanner({
  title,
  subtitle,
  backgroundImageUrl,
}: Omit<HeroBannerProps, 'lang'>) {
  return (
    <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      {/* Background Image */}
      {backgroundImageUrl ? (
        <img
          src={backgroundImageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-200 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}