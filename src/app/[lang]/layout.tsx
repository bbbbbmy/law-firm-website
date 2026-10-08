import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Language } from '@/types'

const languages: Language[] = ['zh', 'en']

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

// SEO 元数据。所有 [lang]/* 页面继承。Next.js 会自动加 basePath /lawfirm。
const SITE_URL = 'https://www.deshanxinyi.com'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isZh = lang === 'zh'

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isZh
        ? '德善新沂律师事务所 - 江苏德善(新沂)律师事务所'
        : 'De Shan Xin Yi Law Firm - Law Firm Website',
      template: isZh ? '%s - 德善新沂律师事务所' : '%s - De Shan Xin Yi Law Firm',
    },
    description: isZh
      ? '江苏德善(新沂)律师事务所——专业法律服务团队，擅长民商事纠纷、刑事辩护、行政诉讼、涉外法律服务等。提供在线咨询、案件委托、合同审查等法律咨询。'
      : 'De Shan Xin Yi Law Firm — Professional legal services in civil & commercial disputes, criminal defense, administrative litigation, and foreign-related legal services.',
    keywords: isZh
      ? ['德善新沂', '德善律师事务所', '新沂律师', '江苏律师事务所', '民商事律师', '刑事辩护', '法律咨询']
      : ['De Shan Xin Yi', 'law firm', 'lawyer', 'legal services', 'Xinyi', 'Jiangsu'],
    authors: [{ name: '江苏德善(新沂)律师事务所' }],
    creator: '江苏德善(新沂)律师事务所',
    publisher: '江苏德善(新沂)律师事务所',
    formatDetection: { telephone: false, address: false, email: false },
    // Bing Webmaster 验证：https://www.bing.com/webmasters
    // meta 需在 <head> 里，Next.js App Router 用 `other` 字段会自动渲染为 <meta name="..." content="..."/>
    other: {
      'msvalidate.01': 'A8DF2D84B5E8F3A4C567534AF972FF33',
    },
    openGraph: {
      type: 'website',
      locale: isZh ? 'zh_CN' : 'en_US',
      url: `${SITE_URL}/${lang}`,
      siteName: isZh ? '德善新沂律师事务所' : 'De Shan Xin Yi Law Firm',
      title: isZh ? '德善新沂律师事务所 - 江苏德善(新沂)律师事务所' : 'De Shan Xin Yi Law Firm',
      description: isZh
        ? '江苏德善(新沂)律师事务所——专业法律服务团队。'
        : 'Professional legal services in Xinyi, Jiangsu.',
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        'zh': `${SITE_URL}/zh`,
        'en': `${SITE_URL}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params
  if (!languages.includes(lang as "zh" | "en")) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {children}
    </div>
  )
}
