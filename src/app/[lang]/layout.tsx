import { notFound } from 'next/navigation'
import type { Language } from '@/types'

const languages: Language[] = ['zh', 'en']

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params
  if (!languages.includes(lang as "zh" | "en")) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {children}
    </div>
  )
}