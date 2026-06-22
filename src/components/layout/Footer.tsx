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
  firmName = '江苏德善(新沂)律师事务所',
  qrCodeUrl,
  contactInfo = {},
  copyright,
  icpNumber,
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-white">
      {/* Gold accent line */}
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href={`/${lang}`} className="flex items-center space-x-3 mb-6 group">
              {logoUrl ? (
                <img src={logoUrl} alt={firmName} className="h-14 w-auto" />
              ) : (
                <div className="w-14 h-14 bg-gold-500 rounded flex items-center justify-center shadow-lg">
                  <span className="text-navy-900 font-bold text-2xl font-serif">
                    {firmName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <span className="font-semibold text-xl text-white">{firmName}</span>
                <span className="block text-gold-400 text-xs tracking-widest uppercase">Law Firm</span>
              </div>
            </Link>
            <p className="text-navy-300 leading-relaxed max-w-md">
              {lang === 'zh'
                ? '江苏德善(新沂)律师事务所是一家专业的法律服务机构，致力于为客户提供高质量、全方位的法律服务。我们拥有丰富的实践经验和专业的律师团队。'
                : 'Jiangsu Deshan (Xinyi) Law Firm is a professional legal service institution committed to providing high-quality, comprehensive legal services to our clients.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-semibold text-sm tracking-wider uppercase mb-6">
              {lang === 'zh' ? '快速链接' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              {[
                { label: lang === 'zh' ? '关于我们' : 'About Us', href: '/about' },
                { label: lang === 'zh' ? '服务领域' : 'Services', href: '/services' },
                { label: lang === 'zh' ? '专业团队' : 'Team', href: '/team' },
                { label: lang === 'zh' ? '资讯动态' : 'News', href: '/news' },
                { label: lang === 'zh' ? '联系我们' : 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${lang}${item.href}`}
                    className="text-navy-300 hover:text-gold-400 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gold-400 font-semibold text-sm tracking-wider uppercase mb-6">
              {lang === 'zh' ? '联系我们' : 'Contact Us'}
            </h3>
            <ul className="space-y-4">
              {contactInfo.address && (
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-navy-300 text-sm">{contactInfo.address}</span>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-navy-300 text-sm">{contactInfo.phone}</span>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-navy-300 text-sm">{contactInfo.email}</span>
                </li>
              )}
            </ul>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="mt-6">
                <img src={qrCodeUrl} alt="QR Code" className="h-28 w-28 border border-navy-700 rounded" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-12 pt-8 border-t border-navy-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-navy-400 text-sm">
            <p>
              {copyright || `© ${currentYear} ${firmName}. All rights reserved.`}
            </p>
            {icpNumber && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-400 transition-colors mt-2 md:mt-0"
              >
                {icpNumber}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}