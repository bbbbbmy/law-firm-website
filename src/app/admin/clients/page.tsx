import { prisma } from '@/lib/prisma'
import ClientsClient from '@/components/admin/ClientsClient'

interface Client {
  id: string
  name: string
  logoUrl: string | null
  website: string | null
  sortOrder: number
}

export default async function ClientsPage() {
  const clients: Client[] = await prisma.client.findMany({
    orderBy: { sortOrder: 'asc' },
  }) as Client[]

  return <ClientsClient clients={clients} />
}