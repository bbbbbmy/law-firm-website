import { PageLayout, HeroBanner } from '@/components/layout'
import { ArticleList } from '@/components/blocks'

interface CasesPageProps {
  params: Promise<{ lang: string }>
}

const mockCases = {
  zh: [
    {
      id: '1',
      slug: 'major-merger-case',
      type: 'case' as const,
      language: 'zh' as "zh" | "en",
      title: '某上市公司重大资产重组案',
      summary: '为客户提供全程法律服务，包括尽职调查、交易结构设计、协议谈判等，顺利实现重大资产重组。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-02-20'),
    },
    {
      id: '2',
      slug: 'international-trade-dispute',
      type: 'case' as const,
      language: 'zh' as "zh" | "en",
      title: '某中外合资企业国际贸易纠纷案',
      summary: '代表中方企业应诉，在国际商事仲裁中成功维护客户合法权益，获得客户高度评价。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-01-15'),
    },
    {
      id: '3',
      slug: 'criminal-defense-success',
      type: 'case' as const,
      language: 'zh' as "zh" | "en",
      title: '某重大刑事案件辩护',
      summary: '被告人最终获得从轻处罚，辩护工作取得良好效果，充分体现了本所刑事辩护的专业水平。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2023-12-10'),
    },
    {
      id: '4',
      slug: 'administrative-litigation',
      type: 'case' as const,
      language: 'zh' as "zh" | "en",
      title: '某公司诉某区政府行政诉讼案',
      summary: '代理企业就行政处罚决定提起行政诉讼，最终撤销原处罚决定，为企业挽回重大损失。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2023-11-20'),
    },
  ],
  en: [
    {
      id: '5',
      slug: 'major-merger-case-en',
      type: 'case' as const,
      language: 'en' as "zh" | "en",
      title: 'Major Asset Restructuring of a Listed Company',
      summary: 'Provided full-range legal services including due diligence, transaction structure design, and agreement negotiations.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-02-20'),
    },
    {
      id: '6',
      slug: 'international-trade-dispute-en',
      type: 'case' as const,
      language: 'en' as "zh" | "en",
      title: 'International Trade Dispute of a JV',
      summary: 'Represented Chinese enterprise in international commercial arbitration, successfully protecting client rights.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-01-15'),
    },
    {
      id: '7',
      slug: 'criminal-defense-success-en',
      type: 'case' as const,
      language: 'en' as "zh" | "en",
      title: 'Major Criminal Defense Case',
      summary: 'Defendant received a lighter sentence. The defense work achieved good results.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2023-12-10'),
    },
  ],
}

export default async function CasesPage({ params }: CasesPageProps) {
  const { lang } = await params
  const langCases = lang === 'zh' ? mockCases.zh : mockCases.en

  return (
    <PageLayout lang={lang as "zh" | "en"}>
      <HeroBanner

        title={lang === 'zh' ? '案例展示' : 'Cases'}
        backgroundImageUrl="https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=1920"
      />

      <ArticleList
        articles={langCases}
        lang={lang as "zh" | "en"}
      />
    </PageLayout>
  )
}