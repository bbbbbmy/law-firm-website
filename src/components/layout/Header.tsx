'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NAV_ITEMS, type Language } from '@/types'

interface HeaderProps {
  lang: Language
  logoUrl?: string
  firmName?: string
}

export default function Header({ lang, logoUrl, firmName = '律师事务所' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const otherLang = lang === 'zh' ? 'en' : 'zh'
  const langLabel = lang === 'zh' ? '中' : 'EN'
  const otherLangLabel = lang === 'zh' ? 'EN' : '中'

  const getLocalizedHref = (href: string) => {
    if (href === '/') return `/${otherLang}`
    return `/${otherLang}${href}`
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${lang}/news?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center space-x-3">
            {logoUrl ? (
              <img src={logoUrl} alt={firmName} className="h-10 w-auto" />
            ) : (
              <div className="w-10 h-10 bg-primary-700 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {firmName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold text-gray-900 hidden sm:block">{firmName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                className="text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium"
              >
                {lang === 'zh' ? item.label : item.labelEn}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <Link
              href={getLocalizedHref('/')}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              {langLabel} | {otherLangLabel}
            </Link>

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {lang === 'zh' ? item.label : item.labelEn}
              </Link>
            ))}
            <Link
              href={getLocalizedHref('/')}
              className="block py-2 text-primary-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
            </Link>
          </nav>
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                >
                  {lang === 'zh' ? '搜索' : 'Search'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}