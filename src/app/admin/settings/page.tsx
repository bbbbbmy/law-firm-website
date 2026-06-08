import { prisma } from '@/lib/prisma'
import SettingsClient from '@/components/admin/SettingsClient'

interface SiteConfig {
  key: string
  value: string | null
  language: string | null
}

export default async function SettingsPage() {
  const configs: SiteConfig[] = await prisma.siteConfig.findMany() as SiteConfig[]

  return <SettingsClient configs={configs} />
}