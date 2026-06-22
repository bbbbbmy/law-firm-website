import Link from 'next/link'
import type { TeamMemberData, Language } from '@/types'

interface TeamGridProps {
  members: TeamMemberData[]
  lang: Language
  title?: string
}

export default function TeamGrid({ members, lang, title }: TeamGridProps) {
  return (
    <div className="py-16 bg-navy-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-12">
            <div className="w-12 h-1 bg-gold-500 mb-4" />
            <h2 className="text-3xl font-bold text-navy-900">{title}</h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gold-300"
            >
              {/* Photo */}
              <div className="w-40 h-40 flex-shrink-0 bg-gradient-to-br from-navy-100 to-navy-200">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-navy-300 text-4xl font-serif font-bold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gold-600 text-sm font-medium mb-3">
                    {lang === 'zh' ? member.titleZh : member.titleEn}
                  </p>
                  <p className="text-navy-600 text-sm line-clamp-2">
                    {lang === 'zh' ? member.bioZh : member.bioEn}
                  </p>
                </div>

                <Link
                  href={`/${lang}/team/${encodeURIComponent(member.name)}`}
                  className="text-gold-600 hover:text-gold-700 text-sm mt-4 inline-flex items-center group"
                >
                  {lang === 'zh' ? '查看详情' : 'View Details'}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <p className="text-center text-navy-400 py-12">
            {lang === 'zh' ? '暂无团队成员' : 'No team members available'}
          </p>
        )}
      </div>
    </div>
  )
}