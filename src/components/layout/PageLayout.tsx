import type { ReactNode } from 'react'
import type { Language } from '@/types'
import { prisma } from '@/lib/prisma'
import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: ReactNode
  lang: Language
  showFooter?: boolean
  showHeader?: boolean
  // 兼容老调用方式：可以直接传 logoUrl/firmName/firmTagline 覆盖
  logoUrl?: string
  firmName?: string
  firmTagline?: string
  // 兼容老调用方式：可以直接传 footerProps 覆盖（但默认从 DB 取）
  headerProps?: Parameters<typeof Header>[0]
  footerProps?: Parameters<typeof Footer>[0]
}

export default async function PageLayout({
  children,
  lang,
  showHeader = true,
  showFooter = true,
  logoUrl: logoUrlProp,
  firmName: firmNameProp,
  firmTagline: firmTaglineProp,
  headerProps: headerPropsOverride,
  footerProps: footerPropsOverride,
}: PageLayoutProps) {
  // 从 site_configs 读 logo 和 tagline（DB 取的优先级低于 prop override）
  let logoUrl = logoUrlProp
  let firmName = firmNameProp
  let firmTagline = firmTaglineProp

  // 任何一个 prop 缺失时，从 DB 读
  if (!logoUrl || !firmName || !firmTagline) {
    const configs = await prisma.siteConfig.findMany()
    const get = (key: string, l?: string) =>
      configs.find(c => c.key === key && (l ? c.language === l : !c.language))?.value ?? null

    if (!logoUrl) logoUrl = get('header_logo_url') ?? undefined
    if (!firmName) {
      // 双语：默认中文（zh），英文用 en
      firmName = (lang === 'zh' ? get('firm_name', 'zh') : get('firm_name', 'en')) ?? undefined
    }
    if (!firmTagline) {
      // 双语 tagline，默认按语言
      firmTagline = (lang === 'zh' ? get('header_tagline_zh', 'zh') : get('header_tagline_en', 'en')) ?? undefined
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <Header
          lang={lang}
          logoUrl={logoUrl}
          firmName={firmName}
          firmTagline={firmTagline}
          {...headerPropsOverride}
        />
      )}
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && (
        <Footer
          lang={lang}
          logoUrl={logoUrl}
          firmName={firmName}
          firmTagline={firmTagline}
          {...footerPropsOverride}
        />
      )}
    </div>
  )
}
