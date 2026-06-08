import { prisma } from '@/lib/prisma'
import TeamClient from '@/components/admin/TeamClient'

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

export default async function TeamPage() {
  const members: TeamMember[] = await prisma.teamMember.findMany({
    orderBy: { sortOrder: 'asc' },
  }) as TeamMember[]

  return <TeamClient members={members} />
}