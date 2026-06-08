import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const practiceArea = await prisma.practiceArea.findUnique({
      where: { id },
    })
    if (!practiceArea) {
      return NextResponse.json(
        { error: 'Practice area not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(practiceArea)
  } catch (error) {
    console.error('Error fetching practice area:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practice area' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const practiceArea = await prisma.practiceArea.update({
      where: { id },
      data: {
        imageUrl: data.imageUrl,
        titleZh: data.titleZh,
        titleEn: data.titleEn,
        descZh: data.descZh,
        descEn: data.descEn,
        sortOrder: data.sortOrder ?? 0,
      },
    })

    return NextResponse.json(practiceArea)
  } catch (error) {
    console.error('Error updating practice area:', error)
    return NextResponse.json(
      { error: 'Failed to update practice area' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.practiceArea.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting practice area:', error)
    return NextResponse.json(
      { error: 'Failed to delete practice area' },
      { status: 500 }
    )
  }
}