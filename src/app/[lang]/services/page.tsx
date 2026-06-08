import { PageLayout, HeroBanner } from '@/components/layout'
import { ArticleList, ExpandableSection } from '@/components/blocks'

interface ServicesPageProps {
  params: Promise<{ lang: string }>
}

const services = {
  zh: [
    {
      title: '民商事纠纷',
      content: '我们拥有丰富的民商事诉讼经验，擅长处理各类合同纠纷、公司业务、股权争议、房产纠纷、借贷纠纷等案件。我们的律师团队以专业的法律素养和敏锐的洞察力，为客户提供全面的法律服务。',
    },
    {
      title: '刑事纠纷',
      content: '在刑事辩护领域，我们的律师具有丰富的出庭经验和扎实的理论功底。我们为犯罪嫌疑人、被告人提供专业的辩护服务，同时也为被害人提供法律咨询和代理服务。',
    },
    {
      title: '行政纠纷',
      content: '我们处理各类行政复议和行政诉讼案件，包括行政处罚、行政许可、行政强制、国家赔偿等。我们的律师熟悉行政法律程序，能够为客户提供专业的法律服务。',
    },
    {
      title: '涉外纠纷',
      content: '我们设有专门的涉外业务部，为中外客户提供国际贸易、跨境投资、涉外仲裁、外商投资等领域的法律服务。我们的律师具有出色的外语沟通能力和国际视野。',
    },
  ],
  en: [
    {
      title: 'Civil and Commercial Disputes',
      content: 'We have extensive experience in civil and commercial litigation, specializing in handling various contract disputes, corporate affairs, equity disputes, real estate disputes, and loan disputes. Our legal team provides comprehensive legal services with professional legal knowledge and keen insight.',
    },
    {
      title: 'Criminal Disputes',
      content: 'In the field of criminal defense, our lawyers have extensive courtroom experience and solid theoretical foundation. We provide professional defense services for criminal suspects and defendants, as well as legal consultation and agency services for victims.',
    },
    {
      title: 'Administrative Disputes',
      content: 'We handle various administrative reconsideration and administrative litigation cases, including administrative penalties, administrative licensing, administrative compulsion, and state compensation. Our lawyers are familiar with administrative legal procedures and can provide professional legal services to clients.',
    },
    {
      title: 'Foreign-Related Disputes',
      content: 'We have a dedicated foreign-related business department that provides legal services for Chinese and foreign clients in international trade, cross-border investment, foreign-related arbitration, and foreign investment. Our lawyers have excellent foreign language communication skills and international perspective.',
    },
  ],
}

const relatedCases = {
  zh: [
    {
      id: '1',
      slug: 'major-merger-case',
      type: 'case' as const,
      language: 'zh' as "zh" | "en",
      title: '某上市公司重大资产重组案',
      summary: '为客户提供全程法律服务，顺利实现重大资产重组。',
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
      summary: '代表中方企业应诉，成功维护客户合法权益。',
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
      summary: '被告人最终获得从轻处罚，辩护工作取得良好效果。',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2023-12-10'),
    },
  ],
  en: [
    {
      id: '4',
      slug: 'major-merger-case-en',
      type: 'case' as const,
      language: 'en' as "zh" | "en",
      title: 'Major Asset Restructuring of a Listed Company',
      summary: 'Provided full-range legal services, successfully achieved major asset restructuring.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-02-20'),
    },
    {
      id: '5',
      slug: 'international-trade-dispute-en',
      type: 'case' as const,
      language: 'en' as "zh" | "en",
      title: 'International Trade Dispute of a JV',
      summary: 'Represented Chinese enterprise in litigation, successfully protected client rights.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2024-01-15'),
    },
    {
      id: '6',
      slug: 'criminal-defense-success-en',
      type: 'case' as const,
      language: 'en' as "zh" | "en",
      title: 'Major Criminal Defense Case',
      summary: 'Defendant received a lighter sentence, defense work achieved good results.',
      content: null,
      author: 'Admin',
      publishedAt: new Date('2023-12-10'),
    },
  ],
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params
  const langServices = lang === 'zh' ? services.zh : services.en
  const langCases = lang === 'zh' ? relatedCases.zh : relatedCases.en

  return (
    <PageLayout lang={lang as "zh" | "en"}>
      <HeroBanner

        title={lang === 'zh' ? '服务领域' : 'Services'}
        backgroundImageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920"
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {langServices.map((service) => (
            <ExpandableSection
              key={service.title}
              title={service.title}
              defaultExpanded={false}
            >
              <p className="text-gray-600 leading-relaxed">
                {service.content}
              </p>
            </ExpandableSection>
          ))}
        </div>
      </section>

      {/* Related Cases */}
      <section className="py-16 bg-gray-50">
        <ArticleList
          articles={langCases}
          lang={lang as "zh" | "en"}
          title={lang === 'zh' ? '相关案例' : 'Related Cases'}
          viewMoreHref={`/${lang}/cases`}
        />
      </section>
    </PageLayout>
  )
}