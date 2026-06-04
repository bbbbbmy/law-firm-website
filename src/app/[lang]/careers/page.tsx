import { PageLayout, HeroBanner } from '@/components/layout'

interface CareersPageProps {
  params: Promise<{ lang: string }>
}

const careersContent = {
  zh: {
    title: '人才招聘',
    intro: '我们诚邀优秀法律人才加入我们的团队，共同发展事业。',
    positions: [
      {
        title: '合伙人',
        requirements: [
          '持有律师执业证，有8年以上执业经验',
          '在某一法律领域有专长',
          '有稳定的案源和客户基础',
          '认同本所文化和价值观',
        ],
      },
      {
        title: '专职律师',
        requirements: [
          '法学本科及以上学历',
          '持有律师执业证',
          '扎实的法律功底和良好的文字能力',
          '有团队协作精神，勤奋敬业',
        ],
      },
      {
        title: '律师助理',
        requirements: [
          '法学本科及以上学历，应届毕业生亦可',
          '通过司法考试',
          '良好的沟通能力和学习能力',
          '工作认真负责，有上进心',
        ],
      },
    ],
    benefits: [
      '有竞争力的薪酬福利',
      '专业培训和发展机会',
      '良好的工作环境和文化氛围',
      '清晰的职业发展路径',
    ],
    contact: {
      email: 'hr@lawfirm.com',
      phone: '021-12345678',
    },
  },
  en: {
    title: 'Careers',
    intro: 'We invite outstanding legal talents to join our team and develop together.',
    positions: [
      {
        title: 'Partner',
        requirements: [
          'Lawyer license holder with 8+ years of practice experience',
          'Expertise in a specific legal field',
          'Stable case sources and client base',
          'Identify with our firm culture and values',
        ],
      },
      {
        title: 'Associate Attorney',
        requirements: [
          'Bachelor degree in law or above',
          'Lawyer license holder',
          'Solid legal foundation and good writing skills',
          'Team spirit, hardworking and dedicated',
        ],
      },
      {
        title: 'Legal Assistant',
        requirements: [
          'Bachelor degree in law, recent graduates welcome',
          'Passed the bar exam',
          'Good communication and learning abilities',
          'Responsible and ambitious',
        ],
      },
    ],
    benefits: [
      'Competitive salary and benefits',
      'Professional training and development opportunities',
      'Good working environment and culture',
      'Clear career development path',
    ],
    contact: {
      email: 'hr@lawfirm.com',
      phone: '021-12345678',
    },
  },
}

export default async function CareersPage({ params }: CareersPageProps) {
  const { lang } = await params
  const content = lang === 'zh' ? careersContent.zh : careersContent.en

  return (
    <PageLayout lang={lang as "zh" | "en"}>
      <HeroBanner

        title={content.title}
        backgroundImageUrl="https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=1920"
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {lang === 'zh' ? '加入我们' : 'Join Us'}
          </h2>
          <p className="text-gray-600 mb-8">{content.intro}</p>

          {/* Positions */}
          <div className="space-y-8">
            {content.positions.map((position) => (
              <div key={position.title} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {position.title}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {position.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {lang === 'zh' ? '我们提供' : 'We Offer'}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {lang === 'zh' ? '联系方式' : 'Contact Us'}
            </h3>
            <p className="text-gray-600">
              {lang === 'zh' ? '邮箱' : 'Email'}: {content.contact.email}
            </p>
            <p className="text-gray-600">
              {lang === 'zh' ? '电话' : 'Phone'}: {content.contact.phone}
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}