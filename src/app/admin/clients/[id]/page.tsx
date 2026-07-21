import { prisma } from '@/lib/prisma'
import ClientFormClient from '@/components/admin/ClientFormClient'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

export default async function EditClientPage({ params }: PageProps) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
  })

  if (!client) {
    notFound()
  }

  return (
    <ClientFormClient
      mode="edit"
      initialData={{
        id: client.id,
        name: client.name,
        logoUrl: client.logoUrl,
        sortOrder: client.sortOrder,
      }}
    />
  )
}