import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Banner {
  id: string
  imageUrl: string
  overlayTextZh: string | null
  overlayTextEn: string | null
  sortOrder: number
  page?: { slug: string }
}

export default async function BannersPage() {
  const banners: Banner[] = await prisma.banner.findMany({
    include: { page: true },
    orderBy: { sortOrder: 'asc' },
  }) as Banner[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banner管理</h1>
        <Link
          href="/admin/banners/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          添加Banner
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center text-gray-500">
            暂无Banner，<Link href="/admin/banners/new" className="text-primary-600 hover:underline">点击添加</Link>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <img
                  src={banner.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">所属页面: {banner.page?.slug || '-'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  中文: {banner.overlayTextZh || '-'}
                </p>
                <p className="text-sm text-gray-500">
                  英文: {banner.overlayTextEn || '-'}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Link
                    href={`/admin/banners/${banner.id}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    编辑
                  </Link>
                  <form action={`/api/admin/banners/${banner.id}?/delete`} method="POST" className="inline">
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        if (!confirm('确定要删除此Banner吗？')) {
                          e.preventDefault()
                        }
                      }}
                    >
                      删除
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}