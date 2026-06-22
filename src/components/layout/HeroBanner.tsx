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
    <div className="relative h-[60vh] min-h-[450px] w-full overflow-hidden">
      {/* Background Image */}
      {backgroundImageUrl ? (
        <img
          src={backgroundImageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-navy-900/40 to-transparent" />

      {/* Decorative gold line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="w-20 h-1 bg-gold-500 mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="mt-8 flex items-center space-x-4">
              <div className="w-12 h-0.5 bg-gold-500/50" />
              <div className="w-12 h-0.5 bg-gold-500/30" />
              <div className="w-12 h-0.5 bg-gold-500/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}