import Link from 'next/link'
import { PageLayout, HeroBanner } from '@/components/layout'
import { prisma } from '@/lib/prisma'

// 关于我们依赖数据库，运行时渲染
export const dynamic = 'force-dynamic'

interface AboutPageProps {
  params: Promise<{ lang: string }>
}

const aboutNavItems = [
  { key: 'intro', labelZh: '律所简介', labelEn: 'Law Firm Introduction', href: '/about#intro' },
  { key: 'honors', labelZh: '荣誉资质', labelEn: 'Honors & Qualifications', href: '/about#honors' },
  { key: 'clients', labelZh: '德善客户', labelEn: 'Esteemed Clients', href: '/about#clients' },
]

// 硬编码 fallback（DB 没数据时用）
const fallbackContent = {
  zh: {
    title: '关于我们',
    pageTitle: '关于我们',
    breadcrumb: '返回首页',
    sections: [
      {
        id: 'intro',
        title: '律所简介',
        content: `我们是一家专业的综合性律师事务所，成立于2000年，经过二十多年的发展，已成为国内领先的律师事务所之一。我们秉持"专业、诚信、高效"的服务理念，为客户提供优质的法律服务。

本所拥有一支由资深律师和青年才俊组成的专业团队，其中多位律师毕业于国内外知名法学院，具有丰富的执业经验和扎实的理论功底。我们擅长处理各类复杂法律事务，尤其在民商事纠纷、刑事辩护、行政诉讼、涉外法律服务等领域有着卓越的表现。`,
      },
      {
        id: 'honors',
        title: '荣誉资质',
        content: `多年来，本所荣获众多荣誉：

• 连续多年被评为"优秀律师事务所"
• 多位律师荣获"优秀律师"称号
• 获得"省级文明律师事务所"荣誉称号
• ISO9001质量管理体系认证
• 多起案例被评为"年度经典案例"`,
      },
      {
        id: 'clients',
        title: '德善客户',
        content: `我们为众多知名企业和机构提供法律服务，包括：

• 大型国有企业
• 上市公司
• 中外合资企业
• 跨国公司
• 政府机构
• 社会团体

我们与客户建立长期稳定的合作关系，赢得客户的信赖和好评。`,
      },
    ],
  },
  en: {
    title: 'About Us',
    pageTitle: 'About Us',
    breadcrumb: 'Back to Home',
    sections: [
      {
        id: 'intro',
        title: 'Law Firm Introduction',
        content: `We are a professional full-service law firm established in 2000. After more than 20 years of development, we have become one of the leading law firms in China. Adhering to the service philosophy of "Professional, Honest, and Efficient", we provide high-quality legal services to our clients.

Our firm has a professional team composed of senior lawyers and young talents, many of whom graduated from renowned law schools both domestically and internationally, possessing rich practical experience and solid theoretical foundation. We excel in handling various complex legal matters, especially in civil and commercial disputes, criminal defense, administrative litigation, and foreign-related legal services.`,
      },
      {
        id: 'honors',
        title: 'Honors and Qualifications',
        content: `Over the years, our firm has received numerous honors:

• Named "Excellent Law Firm" for consecutive years
• Multiple lawyers awarded "Excellent Lawyer" title
• Awarded "Provincial Civilized Law Firm" honor
• ISO9001 Quality Management System Certification
• Multiple cases named "Annual Classic Cases"`,
      },
      {
        id: 'clients',
        title: 'Esteemed Clients',
        content: `We provide legal services to many well-known enterprises and institutions:

• Large state-owned enterprises
• Listed companies
• Sino-foreign joint ventures
• Multinational corporations
• Government agencies
• Social organizations

We have established long-term and stable cooperative relationships with our clients, earning their trust and praise.`,
      },
    ],
  },
}

interface Section {
  id: string
  title: string
  content: string
}

interface PageContent {
  title: string
  pageTitle: string
  breadcrumb: string
  sections: Section[]
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params
  const language = lang === 'zh' ? 'zh' : 'en'

  // 优先从 DB 读 page_contents（slug='about'）
  let langContent: PageContent = (fallbackContent[language] as PageContent)
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'about' },
      include: {
        contents: { where: { language } },
      },
    })
    const dbContent = page?.contents[0]
    if (dbContent?.content) {
      try {
        const parsed = JSON.parse(dbContent.content) as PageContent
        if (parsed.sections && Array.isArray(parsed.sections)) {
          langContent = parsed
        }
      } catch {
        // 解析失败：保持 fallback
      }
    }
  } catch {
    // DB 读取失败：保持 fallback
  }

  return (
    <PageLayout lang={language as 'zh' | 'en'}>
      <HeroBanner
        title={langContent.title}
        backgroundImageUrl="https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=1920"
      />

      {/* Breadcrumb and Secondary Nav */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:px-8">
          {/* Breadcrumb */}
          <div className="py-4">
            <Link
              href={`/lawfirm/${lang}`}
              className="text-gray-500 hover:text-gold-600 transition-colors text-sm"
            >
              ← {langContent.breadcrumb}
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 pb-12">
            {/* Secondary Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-600">
                  <h2 className="text-white font-bold text-lg">{langContent.pageTitle}</h2>
                </div>
                <nav className="py-2">
                  {aboutNavItems.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      className={`block px-6 py-3 text-sm transition-colors border-l-[3px] ${
                        item.key === 'intro'
                          ? 'bg-gold-50 text-gold-700 border-l-gold-500 font-medium'
                          : 'text-gray-600 hover:text-gold-600 hover:bg-gray-50 border-l-transparent'
                      }`}
                    >
                      {lang === 'zh' ? item.labelZh : item.labelEn}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {langContent.sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="bg-white rounded-lg shadow-sm p-8"
                >
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 pb-4 border-b border-gray-200">
                    {section.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}