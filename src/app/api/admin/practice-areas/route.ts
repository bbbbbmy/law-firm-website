import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const practiceAreas = await prisma.practiceArea.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(practiceAreas)
  } catch (error) {
    console.error('Error fetching practice areas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practice areas' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const practiceArea = await prisma.practiceArea.create({
      data: {
        imageUrl: data.imageUrl,
        titleZh: data.titleZh,
        titleEn: data.titleEn,
        descZh: data.descZh,
        descEn: data.descEn,
        articleSlug: data.articleSlug ?? null,
        sortOrder: data.sortOrder ?? 0,
      },
    })

    return NextResponse.json(practiceArea)
  } catch (error) {
    console.error('Error creating practice area:', error)
    return NextResponse.json(
      { error: 'Failed to create practice area' },
      { status: 500 }
    )
  }
}