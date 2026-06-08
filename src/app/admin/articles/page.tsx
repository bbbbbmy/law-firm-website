import { prisma } from '@/lib/prisma'
import ArticlesClient from '@/components/admin/ArticlesClient'

interface Article {
  id: string
  title: string
  slug: string
  type: string
  language: string
  summary: string | null
  publishedAt: Date | null
  createdAt: Date
}

export default async function ArticlesPage() {
  const articles: Article[] = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  }) as Article[]

  return <ArticlesClient articles={articles} />
}