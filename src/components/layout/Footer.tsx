import Link from 'next/link'
import type { Language } from '@/types'

interface FooterProps {
  lang: Language
  logoUrl?: string
  firmName?: string
  qrCodeUrl?: string
  contactInfo?: {
    address?: string
    phone?: string
    email?: string
  }
  copyright?: string
  icpNumber?: string
}

export default function Footer({
  lang,
  logoUrl,
  firmName = '律师事务所',
  qrCodeUrl,
  contactInfo = {},
  copyright,
  icpNumber,
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Logo and QR Code */}
          <div className="flex flex-col items-start">
            <Link href={`/${lang}`} className="flex items-center space-x-3 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={firmName} className="h-12 w-auto" />
              ) : (
                <div className="w-12 h-12 bg-primary-700 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {firmName.charAt(0)}
                  </span>
                </div>
              )}
              <span className="font-semibold text-lg">{firmName}</span>
            </Link>
            {qrCodeUrl && (
              <div className="mt-4">
                <img src={qrCodeUrl} alt="QR Code" className="h-32 w-32" />
              </div>
            )}
          </div>

          {/* Right: Contact Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold mb-2">
              {lang === 'zh' ? '联系我们' : 'Contact Us'}
            </h3>
            {contactInfo.address && (
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">{contactInfo.address}</span>
              </div>
            )}
            {contactInfo.phone && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">{contactInfo.phone}</span>
              </div>
            )}
            {contactInfo.email && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">{contactInfo.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>
            {copyright || `© ${currentYear} ${firmName}. All rights reserved.`}
          </p>
          {icpNumber && (
            <p className="mt-2">
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {icpNumber}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}