'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
  logoUrl: string | null
  website: string | null
  sortOrder: number
}

interface ClientsClientProps {
  clients: Client[]
}

export default function ClientsClient({ clients }: ClientsClientProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此客户吗？')) return
    await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">服务客户管理</h1>
        <Link
          href="/admin/clients/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          添加客户
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {clients.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center text-gray-500">
            暂无客户，<Link href="/admin/clients/new" className="text-primary-600 hover:underline">点击添加</Link>
          </div>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-24 bg-gray-100 flex items-center justify-center relative">
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">{client.name}</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 text-center truncate">{client.name}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    编辑
                  </Link>
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(client.id)}
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