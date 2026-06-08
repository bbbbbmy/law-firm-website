import { prisma } from '@/lib/prisma'
import BannerFormClient from '@/components/admin/BannerFormClient'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

export default async function EditBannerPage({ params }: PageProps) {
  const banner = await prisma.banner.findUnique({
    where: { id: params.id },
  })

  if (!banner) {
    notFound()
  }

  return (
    <BannerFormClient
      mode="edit"
      initialData={{
        id: banner.id,
        imageUrl: banner.imageUrl,
        overlayTextZh: banner.overlayTextZh,
        overlayTextEn: banner.overlayTextEn,
        sortOrder: banner.sortOrder,
      }}
    />
  )
}