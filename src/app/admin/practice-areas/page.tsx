import { prisma } from '@/lib/prisma'
import PracticeAreasClient from '@/components/admin/PracticeAreasClient'

interface PracticeArea {
  id: string
  imageUrl: string
  titleZh: string
  titleEn: string
  descZh: string | null
  descEn: string | null
  sortOrder: number
}

export default async function PracticeAreasPage() {
  const practiceAreas: PracticeArea[] = await prisma.practiceArea.findMany({
    orderBy: { sortOrder: 'asc' },
  }) as PracticeArea[]

  return <PracticeAreasClient practiceAreas={practiceAreas} />
}