import { prisma } from '@/lib/prisma'
import BilingualArticleForm from '@/components/admin/BilingualArticleForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

export default async function EditArticlePage({ params }: PageProps) {
  // Fetch the article - we use the id to find one of the language versions
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  })

  if (!article) {
    notFound()
  }

  // Fetch both language versions by slug
  const articles = await prisma.article.findMany({
    where: { slug: article.slug },
  })

  const zhArticle = articles.find(a => a.language === 'zh')
  const enArticle = articles.find(a => a.language === 'en')

  return (
    <BilingualArticleForm
      mode="edit"
      initialData={{
        id: article.id,
        slug: article.slug,
        type: article.type as 'news' | 'case',
        titleZh: zhArticle?.title ?? null,
        summaryZh: zhArticle?.summary ?? null,
        contentZh: zhArticle?.content ?? null,
        titleEn: enArticle?.title ?? null,
        summaryEn: enArticle?.summary ?? null,
        contentEn: enArticle?.content ?? null,
        coverImageUrl: article.coverImageUrl,
        author: article.author,
        publishedAt: article.publishedAt?.toISOString() ?? null,
      }}
    />
  )
}