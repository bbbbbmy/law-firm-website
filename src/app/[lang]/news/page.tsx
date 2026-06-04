import { PageLayout, HeroBanner } from '@/components/layout'
import { ArticleList } from '@/components/blocks'

interface NewsPageProps {
  params: Promise<{ lang: string }>
}

const mockNews = {
  zh: [
    {
      id: '1',
      slug: 'law-firm-wins-award',
      type: 'news' as const,
      language: 'zh' as "zh" | "en",
      title: '本所荣获年度最佳律师事务所称号',
      summary: '凭借专业的法律服务和卓越的业绩表现，本所在年度评选中脱颖而出，荣获"年度最佳律师事务所"称号。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-03-15'),
    },
    {
      id: '2',
      slug: 'seminar-on-corporate-law',
      type: 'news' as const,
      language: 'zh' as "zh" | "en",
      title: '本所举办企业合规专题研讨会',
      summary: '近日，本所成功举办了企业合规专题研讨会，吸引了众多企业代表参加，共同探讨企业合规管理的新趋势。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-03-10'),
    },
    {
      id: '3',
      slug: 'new-partner-joined',
      type: 'news' as const,
      language: 'zh' as "zh" | "en",
      title: '知名律师李明加入本所担任合伙人',
      summary: '李律师在并购重组领域拥有丰富经验，此次加入将进一步提升本所在该领域的专业服务能力。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-03-05'),
    },
    {
      id: '4',
      slug: 'annual-meeting',
      type: 'news' as const,
      language: 'zh' as "zh" | "en",
      title: '本所召开2024年度工作会议',
      summary: '本次会议总结了2023年度工作成果，表彰了优秀团队和个人，并对2024年度重点工作进行了部署。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-02-01'),
    },
  ],
  en: [
    {
      id: '5',
      slug: 'law-firm-wins-award-en',
      type: 'news' as const,
      language: 'en' as "zh" | "en",
      title: 'Our Firm Wins Annual Best Law Firm Award',
      summary: 'With professional legal services and excellent performance, our firm stood out in the annual assessment and won the "Annual Best Law Firm" award.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-03-15'),
    },
    {
      id: '6',
      slug: 'seminar-on-corporate-law-en',
      type: 'news' as const,
      language: 'en' as "zh" | "en",
      title: 'Our Firm Hosts Corporate Compliance Seminar',
      summary: 'Recently, our firm successfully hosted a corporate compliance seminar, attracting many enterprise representatives to discuss new trends in corporate compliance management.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-03-10'),
    },
    {
      id: '7',
      slug: 'new-partner-joined-en',
      type: 'news' as const,
      language: 'en' as "zh" | "en",
      title: 'Well-known Attorney Li Ming Joins as Partner',
      summary: 'Attorney Li has extensive experience in M&A and restructuring. His joining will further enhance our professional service capabilities in this area.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-03-05'),
    },
  ],
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { lang } = await params
  const langNews = lang === 'zh' ? mockNews.zh : mockNews.en

  return (
    <PageLayout lang={lang as "zh" | "en"}>
      <HeroBanner

        title={lang === 'zh' ? '资讯动态' : 'News'}
        backgroundImageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920"
      />

      <ArticleList
        articles={langNews}
        lang={lang as "zh" | "en"}
      />
    </PageLayout>
  )
}