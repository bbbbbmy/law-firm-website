import { prisma } from '@/lib/prisma'
import TeamFormClient from '@/components/admin/TeamFormClient'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

export default async function EditTeamPage({ params }: PageProps) {
  const member = await prisma.teamMember.findUnique({
    where: { id: params.id },
  })

  if (!member) {
    notFound()
  }

  return (
    <TeamFormClient
      mode="edit"
      initialData={{
        id: member.id,
        name: member.name,
        titleZh: member.titleZh,
        titleEn: member.titleEn,
        bioZh: member.bioZh,
        bioEn: member.bioEn,
        photoUrl: member.photoUrl,
        sortOrder: member.sortOrder,
      }}
    />
  )
}