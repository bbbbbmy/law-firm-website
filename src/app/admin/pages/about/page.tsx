import { prisma } from '@/lib/prisma'
import AboutPageClient from '@/components/admin/AboutPageClient'

// 与公开 about 页的 fallbackContent 同结构，admin 未填时给 client 用
const FALLBACK = {
  zh: {
    title: '关于我们',
    pageTitle: '关于我们',
    breadcrumb: '返回首页',
    sections: [
      { id: 'intro',   title: '律所简介',   content: '我们是一家专业的综合性律师事务所，成立于2000年，经过二十多年的发展，已成为国内领先的律师事务所之一。我们秉持"专业、诚信、高效"的服务理念，为客户提供优质的法律服务。\n\n本所拥有一支由资深律师和青年才俊组成的专业团队，其中多位律师毕业于国内外知名法学院，具有丰富的执业经验和扎实的理论功底。我们擅长处理各类复杂法律事务，尤其在民商事纠纷、刑事辩护、行政诉讼、涉外法律服务等领域有着卓越的表现。' },
      { id: 'honors',  title: '荣誉资质',   content: '多年来，本所荣获众多荣誉：\n\n• 连续多年被评为"优秀律师事务所"\n• 多位律师荣获"优秀律师"称号\n• 获得"省级文明律师事务所"荣誉称号\n• ISO9001质量管理体系认证\n• 多起案例被评为"年度经典案例"' },
      { id: 'clients', title: '德善客户',   content: '我们为众多知名企业和机构提供法律服务，包括：\n\n• 大型国有企业\n• 上市公司\n• 中外合资企业\n• 跨国公司\n• 政府机构\n• 社会团体\n\n我们与客户建立长期稳定的合作关系，赢得客户的信赖和好评。' },
    ],
  },
  en: {
    title: 'About Us',
    pageTitle: 'About Us',
    breadcrumb: 'Back to Home',
    sections: [
      { id: 'intro',   title: 'Law Firm Introduction',     content: 'We are a professional full-service law firm established in 2000. After more than 20 years of development, we have become one of the leading law firms in China. Adhering to the service philosophy of "Professional, Honest, and Efficient", we provide high-quality legal services to our clients.\n\nOur firm has a professional team composed of senior lawyers and young talents, many of whom graduated from renowned law schools both domestically and internationally, possessing rich practical experience and solid theoretical foundation. We excel in handling various complex legal matters, especially in civil and commercial disputes, criminal defense, administrative litigation, and foreign-related legal services.' },
      { id: 'honors',  title: 'Honors and Qualifications', content: 'Over the years, our firm has received numerous honors:\n\n• Named "Excellent Law Firm" for consecutive years\n• Multiple lawyers awarded "Excellent Lawyer" title\n• Awarded "Provincial Civilized Law Firm" honor\n• ISO9001 Quality Management System Certification\n• Multiple cases named "Annual Classic Cases"' },
      { id: 'clients', title: 'Esteemed Clients',          content: 'We provide legal services to many well-known enterprises and institutions:\n\n• Large state-owned enterprises\n• Listed companies\n• Sino-foreign joint ventures\n• Multinational corporations\n• Government agencies\n• Social organizations\n\nWe have established long-term and stable cooperative relationships with our clients, earning their trust and praise.' },
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

export const dynamic = 'force-dynamic'

export default async function AdminAboutPage() {
  // 从 DB 读两种语言的内容。读不到或解析失败时降级到 fallback。
  const page = await prisma.page.findUnique({
    where: { slug: 'about' },
    include: { contents: true },
  })

  const fromDb: Record<string, PageContent> = {}
  for (const c of page?.contents ?? []) {
    try {
      const parsed = JSON.parse(c.content || '') as PageContent
      if (parsed.sections && Array.isArray(parsed.sections)) {
        fromDb[c.language] = parsed
      }
    } catch {
      // 解析失败忽略这一条
    }
  }

  const content = {
    zh: fromDb.zh ?? FALLBACK.zh,
    en: fromDb.en ?? FALLBACK.en,
  }

  return <AboutPageClient initialContent={content} />
}
