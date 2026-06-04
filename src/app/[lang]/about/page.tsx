import { PageLayout, HeroBanner } from '@/components/layout'
import { ExpandableSection } from '@/components/blocks'

interface AboutPageProps {
  params: Promise<{ lang: string }>
}

const content = {
  zh: {
    title: '关于我们',
    sections: [
      {
        title: '律所简介',
        content: '我们是一家专业的综合性律师事务所，成立于2000年，经过二十多年的发展，已成为国内领先的律师事务所之一。我们秉持"专业、诚信、高效"的服务理念，为客户提供优质的法律服务。\n\n本所拥有一支由资深律师和青年才俊组成的专业团队，其中多位律师毕业于国内外知名法学院，具有丰富的执业经验和扎实的理论功底。我们擅长处理各类复杂法律事务，尤其在民商事纠纷、刑事辩护、行政诉讼、涉外法律服务等领域有着卓越的表现。',
      },
      {
        title: '荣誉资质',
        content: '多年来，本所荣获众多荣誉：\n\n• 连续多年被评为"优秀律师事务所"\n• 多位律师荣获"优秀律师"称号\n• 获得"省级文明律师事务所"荣誉称号\n• ISO9001质量管理体系认证\n• 多起案例被评为"年度经典案例"',
      },
      {
        title: '德善客户',
        content: '我们为众多知名企业和机构提供法律服务，包括：\n\n• 大型国有企业\n• 上市公司\n• 中外合资企业\n• 跨国公司\n• 政府机构\n• 社会团体\n\n我们与客户建立长期稳定的合作关系，赢得客户的信赖和好评。',
      },
    ],
  },
  en: {
    title: 'About Us',
    sections: [
      {
        title: 'Law Firm Introduction',
        content: 'We are a professional full-service law firm established in 2000. After more than 20 years of development, we have become one of the leading law firms in China. Adhering to the service philosophy of "Professional, Honest, and Efficient", we provide high-quality legal services to our clients.\n\nOur firm has a professional team composed of senior lawyers and young talents, many of whom graduated from renowned law schools both domestically and internationally, possessing rich practical experience and solid theoretical foundation. We excel in handling various complex legal matters, especially in civil and commercial disputes, criminal defense, administrative litigation, and foreign-related legal services.',
      },
      {
        title: 'Honors and Qualifications',
        content: 'Over the years, our firm has received numerous honors:\n\n• Named "Excellent Law Firm" for consecutive years\n• Multiple lawyers awarded "Excellent Lawyer" title\n• Awarded "Provincial Civilized Law Firm" honor\n• ISO9001 Quality Management System Certification\n• Multiple cases named "Annual Classic Cases"',
      },
      {
        title: 'Esteemed Clients',
        content: 'We provide legal services to many well-known enterprises and institutions:\n\n• Large state-owned enterprises\n• Listed companies\n• Sino-foreign joint ventures\n• Multinational corporations\n• Government agencies\n• Social organizations\n\nWe have established long-term and stable cooperative relationships with our clients, earning their trust and praise.',
      },
    ],
  },
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params
  const langContent = lang === 'zh' ? content.zh : content.en

  return (
    <PageLayout lang={lang as 'zh' | 'en'}>
      <HeroBanner
        title={langContent.title}
        backgroundImageUrl="https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=1920"
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {langContent.sections.map((section) => (
            <ExpandableSection
              key={section.title}
              title={section.title}
              defaultExpanded={false}
            >
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </ExpandableSection>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}