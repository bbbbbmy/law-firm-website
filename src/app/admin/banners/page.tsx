import { prisma } from '@/lib/prisma'
import BannersClient from '@/components/admin/BannersClient'

interface Banner {
  id: string
  imageUrl: string
  overlayTextZh: string | null
  overlayTextEn: string | null
  sortOrder: number
}

export default async function BannersPage() {
  const banners: Banner[] = await prisma.banner.findMany({
    orderBy: { sortOrder: 'asc' },
  }) as Banner[]

  return <BannersClient banners={banners} />
}