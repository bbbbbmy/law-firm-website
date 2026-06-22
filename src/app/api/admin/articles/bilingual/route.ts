import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { titleZh, titleEn, summaryZh, summaryEn, contentZh, contentEn, ...commonData } = data

    // Create articles for both languages (if content exists)
    const articles = []

    if (titleZh || summaryZh || contentZh) {
      articles.push(
        prisma.article.create({
          data: {
            slug: commonData.slug || (titleZh || '').toLowerCase().replace(/\s+/g, '-'),
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
      )
    }

    if (titleEn || summaryEn || contentEn) {
      articles.push(
        prisma.article.create({
          data: {
            slug: commonData.slug || (titleEn || '').toLowerCase().replace(/\s+/g, '-'),
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
      )
    }

    const created = await Promise.all(articles)

    return NextResponse.json(created)
  } catch (error) {
    console.error('Error creating bilingual articles:', error)
    return NextResponse.json(
      { error: 'Failed to create articles' },
      { status: 500 }
    )
  }
}