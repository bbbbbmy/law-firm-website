import { PageLayout, HeroBanner } from '@/components/layout'
import { TeamGrid } from '@/components/blocks'
import { prisma } from '@/lib/prisma'

// 团队页面依赖数据库，运行时渲染
export const dynamic = 'force-dynamic'

interface TeamPageProps {
  params: Promise<{ lang: string }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { lang } = await params
  const language = lang === 'zh' ? 'zh' : 'en'

  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <PageLayout lang={language}>
      <HeroBanner
        title={language === 'zh' ? '专业团队' : 'Our Team'}
        backgroundImageUrl="https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=1920"
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {language === 'zh' ? '专业团队' : 'Our Team'}
          </h2>
          <TeamGrid
            members={teamMembers.map(m => ({
              id: m.id,
              name: m.name,
              titleZh: m.titleZh,
              titleEn: m.titleEn,
              bioZh: m.bioZh,
              bioEn: m.bioEn,
              photoUrl: m.photoUrl,
              sortOrder: m.sortOrder,
            }))}
            lang={language}
          />
        </div>
      </section>
    </PageLayout>
  )
}