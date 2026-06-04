import { PageLayout, HeroBanner } from '@/components/layout'
import { TeamGrid } from '@/components/blocks'

interface TeamPageProps {
  params: Promise<{ lang: string }>
}

const mockTeam = {
  zh: [
    {
      id: '1',
      name: '张伟',
      titleZh: '创始合伙人',
      titleEn: 'Founding Partner',
      bioZh: '张律师毕业于北京大学法学院，从业20余年，在民商事诉讼领域有深厚造诣。曾代理多起重大疑难案件，深受客户信赖。',
      bioEn: 'Attorney Zhang graduated from Peking University Law School and has been practicing for over 20 years, with deep expertise in civil and commercial litigation.',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      sortOrder: 0,
    },
    {
      id: '2',
      name: '李明',
      titleZh: '合伙人',
      titleEn: 'Partner',
      bioZh: '李律师是中国政法大学博士，擅长刑事辩护和企业合规业务。为多家知名企业提供刑事法律风险防控服务。',
      bioEn: 'Attorney Li holds a doctorate from China University of Political Science and Law, specializing in criminal defense and corporate compliance.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      sortOrder: 1,
    },
    {
      id: '3',
      name: '王芳',
      titleZh: '高级律师',
      titleEn: 'Senior Attorney',
      bioZh: '王律师毕业于清华大学法学院，专注涉外法律服务，在国际贸易和跨境投资领域有丰富经验。',
      bioEn: 'Attorney Wang graduated from Tsinghua University Law School and focuses on foreign-related legal services with extensive experience in international trade.',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      sortOrder: 2,
    },
    {
      id: '4',
      name: '刘强',
      titleZh: '律师',
      titleEn: 'Attorney',
      bioZh: '刘律师从业10年，擅长处理各类合同纠纷和公司业务，为众多企业提供常年法律顾问服务。',
      bioEn: 'Attorney Liu has been practicing for 10 years, specializing in contract disputes and corporate affairs, providing ongoing legal counsel to numerous enterprises.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      sortOrder: 3,
    },
  ],
  en: [
    {
      id: '1',
      name: 'Zhang Wei',
      titleZh: 'Founding Partner',
      titleEn: 'Founding Partner',
      bioZh: 'Attorney Zhang graduated from Peking University Law School and has been practicing for over 20 years.',
      bioEn: 'Attorney Zhang graduated from Peking University Law School and has been practicing for over 20 years, with deep expertise in civil and commercial litigation.',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      sortOrder: 0,
    },
    {
      id: '2',
      name: 'Li Ming',
      titleZh: 'Partner',
      titleEn: 'Partner',
      bioZh: 'Attorney Li holds a doctorate from China University of Political Science and Law.',
      bioEn: 'Attorney Li holds a doctorate from China University of Political Science and Law, specializing in criminal defense and corporate compliance.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      sortOrder: 1,
    },
    {
      id: '3',
      name: 'Wang Fang',
      titleZh: 'Senior Attorney',
      titleEn: 'Senior Attorney',
      bioZh: 'Attorney Wang graduated from Tsinghua University Law School.',
      bioEn: 'Attorney Wang graduated from Tsinghua University Law School and focuses on foreign-related legal services with extensive experience in international trade.',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      sortOrder: 2,
    },
    {
      id: '4',
      name: 'Liu Qiang',
      titleZh: 'Attorney',
      titleEn: 'Attorney',
      bioZh: 'Attorney Liu has been practicing for 10 years.',
      bioEn: 'Attorney Liu has been practicing for 10 years, specializing in contract disputes and corporate affairs.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      sortOrder: 3,
    },
  ],
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { lang } = await params
  const langTeam = lang === 'zh' ? mockTeam.zh : mockTeam.en

  return (
    <PageLayout lang={lang as "zh" | "en"}>
      <HeroBanner

        title={lang === 'zh' ? '专业团队' : 'Our Team'}
        backgroundImageUrl="https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=1920"
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {lang === 'zh' ? '专业团队' : 'Our Team'}
          </h2>
          <TeamGrid members={langTeam} lang={lang as "zh" | "en"} />
        </div>
      </section>
    </PageLayout>
  )
}