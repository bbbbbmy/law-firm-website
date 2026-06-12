import Link from 'next/link'
import type { TeamMemberData, Language } from '@/types'

interface TeamGridProps {
  members: TeamMemberData[]
  lang: Language
  title?: string
}

export default function TeamGrid({ members, lang, title }: TeamGridProps) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Photo */}
              <div className="w-48 h-48 flex-shrink-0 bg-gray-200">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-primary-400 text-3xl font-bold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 text-sm mb-2">
                    {lang === 'zh' ? member.titleZh : member.titleEn}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {lang === 'zh' ? member.bioZh : member.bioEn}
                  </p>
                </div>

                <Link
                  href={`/${lang}/team/${encodeURIComponent(member.name)}`}
                  className="text-gray-400 hover:text-primary-600 text-sm mt-4 inline-block"
                >
                  {lang === 'zh' ? '查看详情 →' : 'View Details →'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            {lang === 'zh' ? '暂无团队成员' : 'No team members available'}
          </p>
        )}
      </div>
    </div>
  )
}