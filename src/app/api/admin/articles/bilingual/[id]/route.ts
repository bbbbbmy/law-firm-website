import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const { titleZh, titleEn, summaryZh, summaryEn, contentZh, contentEn, ...commonData } = data

    // Find existing articles with the same slug (both languages)
    const existingArticles = await prisma.article.findMany({
      where: { slug: commonData.slug },
    })

    const existingZh = existingArticles.find(a => a.language === 'zh')
    const existingEn = existingArticles.find(a => a.language === 'en')

    // Update or create Chinese version
    if (titleZh || summaryZh || contentZh) {
      if (existingZh) {
        await prisma.article.update({
          where: { id: existingZh.id },
          data: {
            slug: commonData.slug,
            type: commonData.type,
            language: 'zh',
            title: titleZh,
            summary: summaryZh,
            content: contentZh,
            coverImageUrl: commonData.coverImageUrl || null,
            author: commonData.author,
            publishedAt: commonData.publishedAt ? new Date(commonData.publishedAt) : null,
          },
        })
      } else {
        await prisma.article.create({
          data: {
            slug: commonData.slug,
            type: commonData.type || 'news',
            language: 'zh',
            title: titleZh || '',
            summary: summaryZh,
            content: contentZh,
            coverImageUrl: commonData.coverImageUrl || null,
            author: commonData.author,
            publishedAt: commonData.publishedAt ? new Date(commonData.publishedAt) : null,
          },
        })
      }
    } else if (existingZh) {
      // If ZH content is empty but exists, delete it
      await prisma.article.delete({ where: { id: existingZh.id } })
    }

    // Update or create English version
    if (titleEn || summaryEn || contentEn) {
      if (existingEn) {
        await prisma.article.update({
          where: { id: existingEn.id },
          data: {
            slug: commonData.slug,
            type: commonData.type,
            language: 'en',
            title: titleEn,
            summary: summaryEn,
            content: contentEn,
            coverImageUrl: commonData.coverImageUrl || null,
            author: commonData.author,
            publishedAt: commonData.publishedAt ? new Date(commonData.publishedAt) : null,
          },
        })
      } else {
        await prisma.article.create({
          data: {
            slug: commonData.slug,
            type: commonData.type || 'news',
            language: 'en',
            title: titleEn || '',
            summary: summaryEn,
            content: contentEn,
            coverImageUrl: commonData.coverImageUrl || null,
            author: commonData.author,
            publishedAt: commonData.publishedAt ? new Date(commonData.publishedAt) : null,
          },
        })
      }
    } else if (existingEn) {
      // If EN content is empty but exists, delete it
      await prisma.article.delete({ where: { id: existingEn.id } })
    }

    // Get updated articles
    const updatedArticles = await prisma.article.findMany({
      where: { slug: commonData.slug },
    })

    return NextResponse.json(updatedArticles)
  } catch (error) {
    console.error('Error updating bilingual articles:', error)
    return NextResponse.json(
      { error: 'Failed to update articles' },
      { status: 500 }
    )
  }
}