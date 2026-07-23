'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NAV_ITEMS, type Language } from '@/types'
import { buildHref } from '@/lib/url'

interface HeaderProps {
  lang: Language
  logoUrl?: string
  firmName?: string
}

export default function Header({ lang, logoUrl, firmName = '江苏德善(新沂)律师事务所' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const otherLang = lang === 'zh' ? 'en' : 'zh'
  const langLabel = lang === 'zh' ? '中' : 'EN'
  const otherLangLabel = lang === 'zh' ? 'EN' : '中'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // router.push 不像 <Link> 那样自动加 basePath，需要手动加 /lawfirm
      const isProd = typeof window !== 'undefined' && window.location.pathname.startsWith('/lawfirm')
      const basePath = isProd ? '/lawfirm' : ''
      router.push(`${basePath}${buildHref(`/news?search=${encodeURIComponent(searchQuery.trim())}`, lang)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={buildHref('/', lang)} className="flex items-center space-x-3 group">
            {logoUrl ? (
              <img src={logoUrl} alt={firmName} className="h-12 w-auto" />
            ) : (
              <div className="w-12 h-12 bg-gold-500 rounded flex items-center justify-center shadow-md">
                <span className="text-navy-900 font-bold text-xl font-serif">
                  {firmName.charAt(0)}
                </span>
              </div>
            )}
            <div className="hidden sm:block">
              <span className="text-white font-semibold text-lg tracking-wide">{firmName}</span>
              <span className="block text-gold-400 text-xs tracking-widest uppercase">Law Firm</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={buildHref(item.href, lang)}
                className="px-4 py-2 text-white/90 hover:text-gold-400 transition-colors text-sm font-medium tracking-wide"
              >
                {lang === 'zh' ? item.label : item.labelEn}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <Link
              href={buildHref('/', otherLang)}
              className="text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors border border-gold-500/50 hover:border-gold-400 px-3 py-1 rounded"
            >
              {langLabel} | {otherLangLabel}
            </Link>

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white/80 hover:text-gold-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white/80 hover:text-gold-400 transition-colors"
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
          <nav className="lg:hidden py-4 border-t border-white/10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={buildHref(item.href, lang)}
                className="block py-3 text-white/80 hover:text-gold-400 transition-colors border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {lang === 'zh' ? item.label : item.labelEn}
              </Link>
            ))}
            <Link
              href={buildHref('/', otherLang)}
              className="block py-3 text-gold-400 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
            </Link>
          </nav>
        )}

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-navy-800 shadow-lg border-t border-gold-500/20">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
                  className="flex-1 px-4 py-3 border border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-navy-700 text-white placeholder-navy-300"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-gold-600 text-navy-900 px-6 py-3 rounded-lg hover:bg-gold-500 font-medium"
                >
                  {lang === 'zh' ? '搜索' : 'Search'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="px-4 py-3 text-navy-300 hover:text-white"
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