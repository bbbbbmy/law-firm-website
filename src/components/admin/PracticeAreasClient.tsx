'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PracticeArea {
  id: string
  imageUrl: string
  titleZh: string
  titleEn: string
  descZh: string | null
  descEn: string | null
  sortOrder: number
}

interface PracticeAreasClientProps {
  practiceAreas: PracticeArea[]
}

export default function PracticeAreasClient({ practiceAreas }: PracticeAreasClientProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此业务领域吗？')) return
    await fetch(`/api/admin/practice-areas/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">业务领域管理</h1>
        <Link
          href="/admin/practice-areas/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          添加业务领域
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {practiceAreas.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center text-gray-500">
            暂无业务领域，<Link href="/admin/practice-areas/new" className="text-primary-600 hover:underline">点击添加</Link>
          </div>
        ) : (
          practiceAreas.map((area) => (
            <div key={area.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                {area.imageUrl ? (
                  <img
                    src={area.imageUrl}
                    alt={area.titleZh}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                    {area.titleZh.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{area.titleZh}</h3>
                <p className="text-sm text-primary-600">{area.titleEn}</p>
                {area.descZh && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{area.descZh}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Link
                    href={`/admin/practice-areas/${area.id}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    编辑
                  </Link>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(area.id)}
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