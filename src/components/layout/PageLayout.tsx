import type { ReactNode } from 'react'
import type { Language } from '@/types'
import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: ReactNode
  lang: Language
  logoUrl?: string
  firmName?: string
  showFooter?: boolean
  showHeader?: boolean
  footerProps?: Parameters<typeof Footer>[0]
  headerProps?: Parameters<typeof Header>[0]
}

export default function PageLayout({
  children,
  lang,
  showHeader = true,
  showFooter = true,
  footerProps,
  headerProps,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header lang={lang} {...headerProps} />}
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <Footer lang={lang} {...footerProps} />}
    </div>
  )
}