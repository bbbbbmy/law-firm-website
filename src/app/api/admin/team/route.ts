import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const member = await prisma.teamMember.create({
      data: {
        name: data.name,
        titleZh: data.titleZh,
        titleEn: data.titleEn,
        bioZh: data.bioZh,
        bioEn: data.bioEn,
        photoUrl: data.photoUrl,
        sortOrder: data.sortOrder || 0,
      },
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}