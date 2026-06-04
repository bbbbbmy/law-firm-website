import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const article = await prisma.article.create({
      data: {
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
        type: data.type || 'news',
        language: data.language || 'zh',
        title: data.title,
        summary: data.summary,
        content: data.content,
        author: data.author,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}