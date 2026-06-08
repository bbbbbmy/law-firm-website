import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        contents: true,
      },
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const data = await request.json()

    // Update page content for specific language
    const { language, title, content, bannerImages, metaDescription } = data

    // Find or create page
    let page = await prisma.page.findUnique({
      where: { slug },
    })

    if (!page) {
      page = await prisma.page.create({
        data: { slug },
      })
    }

    // Upsert page content
    const pageContent = await prisma.pageContent.upsert({
      where: {
        pageId_language: {
          pageId: page.id,
          language: language || 'zh',
        },
      },
      update: {
        title,
        content,
        bannerImages,
        metaDescription,
      },
      create: {
        pageId: page.id,
        language: language || 'zh',
        title,
        content,
        bannerImages: bannerImages || [],
        metaDescription,
      },
    })

    return NextResponse.json(pageContent)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}