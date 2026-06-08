'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TeamMember {
  id: string
  name: string
  titleZh: string | null
  titleEn: string | null
  bioZh: string | null
  bioEn: string | null
  photoUrl: string | null
  sortOrder: number
}

interface TeamClientProps {
  members: TeamMember[]
}

export default function TeamClient({ members }: TeamClientProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此成员吗？')) return
    await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">团队成员管理</h1>
        <Link
          href="/admin/team/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          添加成员
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center text-gray-500">
            暂无团队成员，<Link href="/admin/team/new" className="text-primary-600 hover:underline">点击添加</Link>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-square bg-gray-200 relative">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary-600">{member.titleZh}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{member.bioZh}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    编辑
                  </Link>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(member.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}