import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PageLayout } from '@/components/layout'
import type { Language } from '@/types'

interface TeamMemberPageProps {
  params: Promise<{ lang: string; slug: string }>
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { lang, slug } = await params
  const language = lang as Language

  // Decode the slug back to name
  const name = slug.replace(/-/g, ' ').replace(/\\s\\+/g, ' ')

  // Try to find by name (case insensitive)
  const teamMember = await prisma.teamMember.findFirst({
    where: {
      name: {
        equals: name.replace(/-/g, ' '),
        mode: 'insensitive',
      },
    },
  })

  // If not found, try direct match
  const member = teamMember || await prisma.teamMember.findFirst({
    where: {
      name: decodeURIComponent(slug),
    },
  })

  if (!member) {
    notFound()
  }

  return (
    <PageLayout lang={language}>
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href={`/${lang}/team`}
            className="text-primary-600 hover:text-primary-700 mb-8 inline-block"
          >
            ← {language === 'zh' ? '返回团队列表' : 'Back to Team'}
          </a>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-auto rounded-lg shadow"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-6xl text-gray-400">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h1>
                <p className="text-xl text-primary-600 mb-4">
                  {language === 'zh' ? member.titleZh : member.titleEn}
                </p>

                <div className="prose max-w-none">
                  {language === 'zh' ? (
                    member.bioZh ? (
                      <p className="text-gray-600 whitespace-pre-line">{member.bioZh}</p>
                    ) : (
                      <p className="text-gray-400 italic">暂无简介</p>
                    )
                  ) : member.bioEn ? (
                    <p className="text-gray-600 whitespace-pre-line">{member.bioEn}</p>
                  ) : (
                    <p className="text-gray-400 italic">No biography available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}