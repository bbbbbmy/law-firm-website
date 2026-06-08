import { prisma } from '@/lib/prisma'
import PracticeAreaFormClient from '@/components/admin/PracticeAreaFormClient'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

export default async function EditPracticeAreaPage({ params }: PageProps) {
  const practiceArea = await prisma.practiceArea.findUnique({
    where: { id: params.id },
  })

  if (!practiceArea) {
    notFound()
  }

  return (
    <PracticeAreaFormClient
      mode="edit"
      initialData={{
        id: practiceArea.id,
        imageUrl: practiceArea.imageUrl,
        titleZh: practiceArea.titleZh,
        titleEn: practiceArea.titleEn,
        descZh: practiceArea.descZh,
        descEn: practiceArea.descEn,
        sortOrder: practiceArea.sortOrder,
      }}
    />
  )
}