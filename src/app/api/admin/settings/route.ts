import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { key, value, language } = data

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    // Upsert site config
    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { value, language },
      create: { key, value, language },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating site config:', error)
    return NextResponse.json(
      { error: 'Failed to update site config' },
      { status: 500 }
    )
  }
}