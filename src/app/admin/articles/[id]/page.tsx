import { prisma } from '@/lib/prisma'
import ArticleFormClient from '@/components/admin/ArticleFormClient'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

export default async function EditArticlePage({ params }: PageProps) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  })

  if (!article) {
    notFound()
  }

  return (
    <ArticleFormClient
      mode="edit"
      initialData={{
        id: article.id,
        slug: article.slug,
        type: article.type as 'news' | 'case',
        language: article.language as 'zh' | 'en',
        title: article.title,
        summary: article.summary,
        content: article.content,
        author: article.author,
        publishedAt: article.publishedAt?.toISOString() ?? null,
      }}
    />
  )
}